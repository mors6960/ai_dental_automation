import { Injectable } from "@nestjs/common";
import { Logger } from "@nestjs/common";
import { createServicePayload } from "@/common/utils/response.util";

import {
  AUTOMATION_WORKFLOW_NAMES,
  WORKFLOW_RUN_STATUSES,
} from "@/modules/automation/automation.constants";
import { AutomationRunRepository } from "@/modules/automation/automation-run.repository";
import type { AutomationDomainEvent } from "@/modules/automation/automation.types";
import { N8nWorkflowCallbackDto } from "@/modules/automation/dto/n8n-workflow-callback.dto";

@Injectable()
export class AutomationService {
  private readonly logger = new Logger(AutomationService.name);

  constructor(private readonly automationRunRepository: AutomationRunRepository) {}

  startWorkflow(event: AutomationDomainEvent, workflowName: string) {
    return this.automationRunRepository.createOrGetFromEvent(event, workflowName);
  }

  markWorkflowRunning(workflowRunId: string) {
    return this.automationRunRepository.incrementAttempt(workflowRunId);
  }

  completeWorkflow(workflowRunId: string) {
    return this.automationRunRepository.update(workflowRunId, {
      status: WORKFLOW_RUN_STATUSES.completed,
      completedAt: new Date().toISOString(),
    });
  }

  failWorkflow(workflowRunId: string, failureReason: string) {
    return this.automationRunRepository.update(workflowRunId, {
      status: WORKFLOW_RUN_STATUSES.failed,
      failedAt: new Date().toISOString(),
      lastError: failureReason,
    });
  }

  skipWorkflow(workflowRunId: string, statusReason: string) {
    return this.automationRunRepository.update(workflowRunId, {
      status: WORKFLOW_RUN_STATUSES.skipped,
      statusReason,
      skippedAt: new Date().toISOString(),
    });
  }

  async receiveN8nCallback(workflow: string, payload: N8nWorkflowCallbackDto) {
    const normalizedWorkflow = workflow.trim().toLowerCase();
    const allowedWorkflows = new Set<string>(Object.values(AUTOMATION_WORKFLOW_NAMES));

    if (!allowedWorkflows.has(normalizedWorkflow)) {
      throw new Error(`Unsupported n8n workflow callback: ${normalizedWorkflow}`);
    }

    if (normalizedWorkflow !== payload.workflow) {
      throw new Error(
        `Workflow callback mismatch. path=${normalizedWorkflow} body=${payload.workflow}`,
      );
    }

    this.logger.log(
      `Received n8n callback for ${payload.workflow}. event=${payload.eventName} entityId=${payload.entityId ?? "unknown"} executionId=${payload.workflowExecutionId ?? "unknown"} status=${payload.status ?? "unknown"}`,
    );

    if (payload.payload) {
      this.logger.debug(`n8n callback payload=${JSON.stringify(payload.payload)}`);
    }

    return createServicePayload("n8n callback processed successfully.", {
      accepted: true,
      workflow: payload.workflow,
      eventName: payload.eventName,
      entityId: payload.entityId ?? null,
      workflowExecutionId: payload.workflowExecutionId ?? null,
      status: payload.status ?? null,
    });
  }
}
