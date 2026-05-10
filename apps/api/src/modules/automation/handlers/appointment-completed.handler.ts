import { Injectable, Logger } from "@nestjs/common";

import { AUTOMATION_EVENT_NAMES } from "@/modules/automation/automation.constants";
import { ReviewRequestWorkflow } from "@/modules/automation/review-request.workflow";
import { AutomationService } from "@/modules/automation/automation.service";
import type { AutomationHandler } from "@/modules/automation/interfaces/automation-handler.interface";
import type { AutomationDomainEvent, AutomationExecutionContext } from "@/modules/automation/automation.types";

@Injectable()
export class AppointmentCompletedHandler implements AutomationHandler {
  readonly eventName = AUTOMATION_EVENT_NAMES.appointmentCompleted;
  private readonly logger = new Logger(AppointmentCompletedHandler.name);

  constructor(
    private readonly automationService: AutomationService,
    private readonly reviewRequestWorkflow: ReviewRequestWorkflow,
  ) {}

  async handle(event: AutomationDomainEvent, context: AutomationExecutionContext) {
    const workflowRun = await this.automationService.startWorkflow(event, "review_request");
    this.logger.log(`Processing review request workflow for appointment ${event.entityId}`);
    await this.reviewRequestWorkflow.run(event, context, workflowRun);
  }
}
