import type {
  AutomationDomainEvent,
  AutomationExecutionContext,
} from "@/modules/automation/automation.types";

export interface AutomationHandler<TPayload = Record<string, unknown>> {
  readonly eventName: string;
  handle(event: AutomationDomainEvent<TPayload>, context: AutomationExecutionContext): Promise<void>;
}
