import { Injectable, Logger } from "@nestjs/common";
import { ConversationChannel, MessageRole } from "@prisma/client";

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
import { WhatsappService } from "@/modules/whatsapp/whatsapp.service";

@Injectable()
export class LeadFollowupWorkflow {
  private readonly logger = new Logger(LeadFollowupWorkflow.name);

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

    const lead = await this.prisma.lead.findUnique({
      where: { id: event.entityId },
      include: {
        patient: true,
      },
    });

    if (!lead) {
      await this.automationService.failWorkflow(workflowRun.id, "missing_lead");
      this.metrics.increment("lead_followup.failed");
      throw new Error(`Lead ${event.entityId} not found.`);
    }

    const destination = lead.whatsappNumber ?? lead.patient?.whatsappNumber ?? lead.phone ?? lead.patient?.phone;

    if (!destination) {
      await this.prisma.leadActivity.create({
        data: {
          leadId: lead.id,
          type: "FOLLOW_UP_SKIPPED",
          title: "Lead follow-up skipped",
          description: "No WhatsApp or phone target was available.",
          metadata: { reason: REMINDER_WORKFLOW_REASONS.missingTarget },
        },
      });
      await this.automationService.skipWorkflow(workflowRun.id, REMINDER_WORKFLOW_REASONS.missingTarget);
      this.metrics.increment("lead_followup.skipped");
      return;
    }

    if (!isValidAutomationPhoneNumber(destination)) {
      await this.prisma.leadActivity.create({
        data: {
          leadId: lead.id,
          type: "FOLLOW_UP_SKIPPED",
          title: "Lead follow-up skipped",
          description: "Lead target phone number was invalid.",
          metadata: { reason: REMINDER_WORKFLOW_REASONS.invalidTarget, destination },
        },
      });
      await this.automationService.skipWorkflow(workflowRun.id, REMINDER_WORKFLOW_REASONS.invalidTarget);
      this.metrics.increment("lead_followup.skipped");
      return;
    }

    const existingActivity = await this.prisma.leadActivity.findFirst({
      where: {
        leadId: lead.id,
        type: "FOLLOW_UP_SENT",
      },
      orderBy: { createdAt: "desc" },
    });

    if (existingActivity) {
      await this.automationService.completeWorkflow(workflowRun.id);
      return;
    }

    const conversation = await this.prisma.conversation.findFirst({
      where: {
        leadId: lead.id,
        channel: ConversationChannel.WHATSAPP,
      },
    }) ??
      (await this.prisma.conversation.create({
        data: {
          clinicId: lead.clinicId,
          patientId: lead.patientId,
          leadId: lead.id,
          channel: ConversationChannel.WHATSAPP,
          status: "OPEN",
          startedAt: new Date(),
        },
      }));

    try {
      const message = await this.whatsappService.send({
        to: destination,
        templateKey: "LEAD_FOLLOW_UP",
        message: `Hi ${lead.fullName.split(" ")[0] ?? "there"}, this is Aria from Lumiere Dental. I can help answer your questions and book your visit whenever you're ready.`,
      });

      await this.prisma.message.create({
        data: {
          conversationId: conversation.id,
          appointmentId: null,
          role: MessageRole.AI,
          direction: "OUTBOUND",
          externalMessageId:
            message.data &&
            typeof message.data === "object" &&
            "id" in message.data &&
            typeof message.data.id === "string"
              ? message.data.id
              : null,
          content: `Hi ${lead.fullName.split(" ")[0] ?? "there"}, this is Aria from Lumiere Dental. I can help answer your questions and book your visit whenever you're ready.`,
          sentAt: new Date(),
        },
      });

      await this.prisma.leadActivity.create({
        data: {
          leadId: lead.id,
          type: "FOLLOW_UP_SENT",
          title: "Lead follow-up sent",
          description: "Automated WhatsApp follow-up sent after lead creation.",
          metadata: { destination },
        },
      });

      await this.automationService.completeWorkflow(workflowRun.id);
      this.metrics.increment("lead_followup.sent");
      this.metrics.observeLatency("lead_followup.send_latency", startedAt);
      this.logger.log(`Sent lead follow-up for lead ${lead.id}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown lead follow-up error";
      await this.prisma.leadActivity.create({
        data: {
          leadId: lead.id,
          type: "FOLLOW_UP_FAILED",
          title: "Lead follow-up failed",
          description: message,
        },
      });

      if (context.attemptNumber >= context.maxAttempts) {
        await this.automationService.failWorkflow(workflowRun.id, message);
        this.metrics.increment("lead_followup.failed");
      } else {
        this.metrics.increment("lead_followup.retry");
      }

      throw error;
    }
  }

}
