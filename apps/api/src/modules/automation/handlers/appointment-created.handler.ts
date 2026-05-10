import { Injectable, Logger } from "@nestjs/common";

import { AUTOMATION_EVENT_NAMES } from "@/modules/automation/automation.constants";
import { BookingConfirmationWorkflow } from "@/modules/automation/booking-confirmation.workflow";
import { AutomationService } from "@/modules/automation/automation.service";
import type { AutomationHandler } from "@/modules/automation/interfaces/automation-handler.interface";
import type { AutomationDomainEvent, AutomationExecutionContext } from "@/modules/automation/automation.types";

@Injectable()
export class AppointmentCreatedHandler implements AutomationHandler {
  readonly eventName = AUTOMATION_EVENT_NAMES.appointmentCreated;
  private readonly logger = new Logger(AppointmentCreatedHandler.name);

  constructor(
    private readonly automationService: AutomationService,
    private readonly bookingConfirmationWorkflow: BookingConfirmationWorkflow,
  ) {}

  async handle(event: AutomationDomainEvent, context: AutomationExecutionContext) {
    const workflowRun = await this.automationService.startWorkflow(event, "booking_confirmation");
    this.logger.log(`Processing booking confirmation workflow for appointment ${event.entityId}`);
    await this.bookingConfirmationWorkflow.run(event, context, workflowRun);
  }
}
