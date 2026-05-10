import { Injectable, Logger } from "@nestjs/common";
import { ConversationChannel, ReviewRequestStatus } from "@prisma/client";

import { REMINDER_WORKFLOW_REASONS } from "@/modules/automation/automation.constants";
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
import { ReviewsService } from "@/modules/reviews/reviews.service";

@Injectable()
export class ReviewRequestWorkflow {
  private readonly logger = new Logger(ReviewRequestWorkflow.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly automationService: AutomationService,
    private readonly reviewsService: ReviewsService,
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
      },
    });

    if (!appointment || !appointment.patient) {
      await this.automationService.failWorkflow(workflowRun.id, "missing_appointment_or_patient");
      this.metrics.increment("review_request.failed");
      throw new Error(`Appointment ${event.entityId} not found for review workflow.`);
    }

    const channel = appointment.confirmationChannel ?? ConversationChannel.WHATSAPP;

    if (channel !== ConversationChannel.WHATSAPP) {
      await this.automationService.skipWorkflow(workflowRun.id, REMINDER_WORKFLOW_REASONS.unsupportedChannel);
      this.metrics.increment("review_request.skipped");
      return;
    }

    const destination = appointment.patient.whatsappNumber ?? appointment.patient.phone;

    if (!destination) {
      await this.automationService.skipWorkflow(workflowRun.id, REMINDER_WORKFLOW_REASONS.missingTarget);
      this.metrics.increment("review_request.skipped");
      return;
    }

    if (!isValidAutomationPhoneNumber(destination)) {
      await this.automationService.skipWorkflow(workflowRun.id, REMINDER_WORKFLOW_REASONS.invalidTarget);
      this.metrics.increment("review_request.skipped");
      return;
    }

    const reviewRequest = await this.reviewsService.createOrReuseReviewRequest({
      clinicId: appointment.clinicId,
      patientId: appointment.patientId,
      appointmentId: appointment.id,
      channel,
    });

    if (reviewRequest.status === ReviewRequestStatus.SENT) {
      await this.automationService.completeWorkflow(workflowRun.id);
      return;
    }

    try {
      await this.reviewsService.sendReviewRequest({
        reviewRequestId: reviewRequest.id,
        appointmentId: appointment.id,
        to: destination,
      });

      await this.automationService.completeWorkflow(workflowRun.id);
      this.metrics.increment("review_request.sent");
      this.metrics.observeLatency("review_request.send_latency", startedAt);
      this.logger.log(`Sent review request for appointment ${appointment.id}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown review request error";

      if (context.attemptNumber >= context.maxAttempts) {
        await this.reviewsService.markRequestFailed(reviewRequest.id);
        await this.automationService.failWorkflow(workflowRun.id, message);
        this.metrics.increment("review_request.failed");
      } else {
        this.metrics.increment("review_request.retry");
      }

      throw error;
    }
  }

}
