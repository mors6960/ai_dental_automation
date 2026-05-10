import { Injectable, Logger } from "@nestjs/common";
import {
  ConversationChannel,
  Prisma,
  ReminderStatus,
} from "@prisma/client";

import {
  REMINDER_WORKFLOW_REASONS,
  REMINDER_WORKFLOW_TEMPLATE_KEYS,
} from "@/modules/automation/automation.constants";
import { AutomationMetricsService } from "@/modules/automation/automation-metrics.service";
import { AutomationService } from "@/modules/automation/automation.service";
import {
  isTerminalWorkflowStatus,
  isValidAutomationPhoneNumber,
} from "@/modules/automation/automation-workflow.helpers";
import type {
  AutomationDomainEvent,
  AutomationExecutionContext,
  WorkflowRunRecord,
} from "@/modules/automation/automation.types";
import { PrismaService } from "@/database/prisma.service";
import { WhatsappService } from "@/modules/whatsapp/whatsapp.service";

@Injectable()
export class BookingConfirmationWorkflow {
  private readonly logger = new Logger(BookingConfirmationWorkflow.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly automationService: AutomationService,
    private readonly whatsappService: WhatsappService,
    private readonly metrics: AutomationMetricsService,
  ) {}

  async run(
    event: AutomationDomainEvent,
    context: AutomationExecutionContext,
    workflowRun: WorkflowRunRecord,
  ) {
    if (isTerminalWorkflowStatus(workflowRun.status)) {
      return;
    }

    await this.automationService.markWorkflowRunning(workflowRun.id);
    const startedAt = Date.now();

    const appointment = await this.prisma.appointment.findUnique({
      where: { id: event.entityId },
      include: {
        patient: true,
        service: true,
      },
    });

    if (!appointment || !appointment.patient) {
      await this.automationService.failWorkflow(workflowRun.id, "missing_appointment_or_patient");
      this.metrics.increment("booking_confirmation.failed");
      throw new Error(`Appointment ${event.entityId} is missing patient context.`);
    }

    const channel = appointment.confirmationChannel ?? ConversationChannel.WHATSAPP;
    const reminder = await this.findOrCreateReminder(
      appointment.clinicId,
      appointment.id,
      channel,
    );

    if (
      reminder.status === ReminderStatus.SENT ||
      reminder.status === ReminderStatus.SKIPPED
    ) {
      if (reminder.status === ReminderStatus.SKIPPED) {
        await this.automationService.skipWorkflow(
          workflowRun.id,
          reminder.statusReason ?? "existing_skipped_reminder",
        );
      } else {
        await this.automationService.completeWorkflow(workflowRun.id);
      }
      return;
    }

    if (channel !== ConversationChannel.WHATSAPP) {
      await this.markReminderSkipped(
        reminder.id,
        REMINDER_WORKFLOW_REASONS.unsupportedChannel,
        context.attemptNumber,
      );
      await this.automationService.skipWorkflow(
        workflowRun.id,
        REMINDER_WORKFLOW_REASONS.unsupportedChannel,
      );
      this.metrics.increment("booking_confirmation.skipped");
      return;
    }

    const destination = appointment.patient.whatsappNumber ?? appointment.patient.phone;

    if (!destination) {
      await this.markReminderSkipped(
        reminder.id,
        REMINDER_WORKFLOW_REASONS.missingTarget,
        context.attemptNumber,
      );
      await this.automationService.skipWorkflow(
        workflowRun.id,
        REMINDER_WORKFLOW_REASONS.missingTarget,
      );
      this.metrics.increment("booking_confirmation.skipped");
      return;
    }

    if (!isValidAutomationPhoneNumber(destination)) {
      await this.markReminderSkipped(
        reminder.id,
        REMINDER_WORKFLOW_REASONS.invalidTarget,
        context.attemptNumber,
      );
      await this.automationService.skipWorkflow(
        workflowRun.id,
        REMINDER_WORKFLOW_REASONS.invalidTarget,
      );
      this.metrics.increment("booking_confirmation.skipped");
      return;
    }

    await this.prisma.reminder.update({
      where: { id: reminder.id },
      data: {
        status: ReminderStatus.SENDING,
        attemptCount: context.attemptNumber,
        lastAttemptedAt: new Date(),
        failureReason: null,
        statusReason: null,
      },
    });

    try {
      const response = await this.whatsappService.sendReminder({
        appointmentId: appointment.id,
        to: destination,
        reminderType: REMINDER_WORKFLOW_TEMPLATE_KEYS.bookingConfirmation,
      });

      const providerMessageId =
        response.data &&
        typeof response.data === "object" &&
        "id" in response.data &&
        typeof response.data.id === "string"
          ? response.data.id
          : null;

      await this.prisma.reminder.update({
        where: { id: reminder.id },
        data: {
          status: ReminderStatus.SENT,
          sentAt: new Date(),
          providerMessageId,
          attemptCount: context.attemptNumber,
          lastAttemptedAt: new Date(),
        },
      });

      await this.automationService.completeWorkflow(workflowRun.id);
      this.metrics.increment("booking_confirmation.sent");
      this.metrics.observeLatency("booking_confirmation.send_latency", startedAt);
      this.logger.log(`Sent booking confirmation for appointment ${appointment.id}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown WhatsApp send error";

      if (context.attemptNumber >= context.maxAttempts) {
        await this.prisma.reminder.update({
          where: { id: reminder.id },
          data: {
            status: ReminderStatus.FAILED,
            attemptCount: context.attemptNumber,
            lastAttemptedAt: new Date(),
            failureReason: message,
          },
        });
        await this.automationService.failWorkflow(workflowRun.id, message);
        this.metrics.increment("booking_confirmation.failed");
      } else {
        await this.prisma.reminder.update({
          where: { id: reminder.id },
          data: {
            status: ReminderStatus.QUEUED,
            attemptCount: context.attemptNumber,
            lastAttemptedAt: new Date(),
            failureReason: message,
            statusReason: "retrying",
          },
        });
        this.metrics.increment("booking_confirmation.retry");
      }

      this.logger.error(`Booking confirmation send failed for appointment ${appointment.id}: ${message}`);
      throw error;
    }
  }

  private async findOrCreateReminder(
    clinicId: string,
    appointmentId: string,
    channel: ConversationChannel,
  ) {
    try {
      return await this.prisma.reminder.upsert({
        where: {
          appointmentId_templateKey_channel: {
            appointmentId,
            templateKey: REMINDER_WORKFLOW_TEMPLATE_KEYS.bookingConfirmation,
            channel,
          },
        },
        update: {},
        create: {
          clinicId,
          appointmentId,
          channel,
          templateKey: REMINDER_WORKFLOW_TEMPLATE_KEYS.bookingConfirmation,
          scheduledFor: new Date(),
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return this.prisma.reminder.findUniqueOrThrow({
          where: {
            appointmentId_templateKey_channel: {
              appointmentId,
              templateKey: REMINDER_WORKFLOW_TEMPLATE_KEYS.bookingConfirmation,
              channel,
            },
          },
        });
      }

      throw error;
    }
  }

  private async markReminderSkipped(
    reminderId: string,
    reason: string,
    attemptCount: number,
  ) {
    await this.prisma.reminder.update({
      where: { id: reminderId },
      data: {
        status: ReminderStatus.SKIPPED,
        attemptCount,
        lastAttemptedAt: new Date(),
        statusReason: reason,
      },
    });
  }

}
