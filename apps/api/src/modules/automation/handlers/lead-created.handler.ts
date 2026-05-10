import { Injectable, Logger } from "@nestjs/common";

import { AUTOMATION_EVENT_NAMES } from "@/modules/automation/automation.constants";
import { LeadFollowupWorkflow } from "@/modules/automation/lead-followup.workflow";
import { AutomationService } from "@/modules/automation/automation.service";
import type { AutomationHandler } from "@/modules/automation/interfaces/automation-handler.interface";
import type { AutomationDomainEvent, AutomationExecutionContext } from "@/modules/automation/automation.types";

@Injectable()
export class LeadCreatedHandler implements AutomationHandler {
  readonly eventName = AUTOMATION_EVENT_NAMES.leadCreated;
  private readonly logger = new Logger(LeadCreatedHandler.name);

  constructor(
    private readonly automationService: AutomationService,
    private readonly leadFollowupWorkflow: LeadFollowupWorkflow,
  ) {}

  async handle(event: AutomationDomainEvent, context: AutomationExecutionContext) {
    const workflowRun = await this.automationService.startWorkflow(event, "lead_followup");
    this.logger.log(`Processing lead follow-up workflow for lead ${event.entityId}`);
    await this.leadFollowupWorkflow.run(event, context, workflowRun);
  }
}
