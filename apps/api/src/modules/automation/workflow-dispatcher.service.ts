import { Injectable, Logger } from "@nestjs/common";

import { AppointmentCompletedHandler } from "@/modules/automation/handlers/appointment-completed.handler";
import { AppointmentCreatedHandler } from "@/modules/automation/handlers/appointment-created.handler";
import { LeadCreatedHandler } from "@/modules/automation/handlers/lead-created.handler";
import type { AutomationHandler } from "@/modules/automation/interfaces/automation-handler.interface";
import type { AutomationDomainEvent, AutomationExecutionContext } from "@/modules/automation/automation.types";

@Injectable()
export class WorkflowDispatcherService {
  private readonly logger = new Logger(WorkflowDispatcherService.name);

  constructor(
    private readonly leadCreatedHandler: LeadCreatedHandler,
    private readonly appointmentCreatedHandler: AppointmentCreatedHandler,
    private readonly appointmentCompletedHandler: AppointmentCompletedHandler,
  ) {}

  async dispatch(event: AutomationDomainEvent, context: AutomationExecutionContext) {
    const handlers = this.resolveHandlers(event.eventName);

    for (const handler of handlers) {
      await handler.handle(event, context);
    }
  }

  private resolveHandlers(eventName: string): AutomationHandler[] {
    const handlers = [
      this.leadCreatedHandler,
      this.appointmentCreatedHandler,
      this.appointmentCompletedHandler,
    ].filter((handler) => handler.eventName === eventName);

    if (handlers.length === 0) {
      this.logger.debug(`No automation handlers registered for ${eventName}`);
    }

    return handlers;
  }
}
