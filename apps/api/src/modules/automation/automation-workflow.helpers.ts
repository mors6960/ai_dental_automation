import { WORKFLOW_RUN_STATUSES } from "@/modules/automation/automation.constants";

const AUTOMATION_PHONE_NUMBER_REGEX = /^\+?[1-9]\d{7,14}$/;

export function isTerminalWorkflowStatus(status?: string) {
  return (
    status === WORKFLOW_RUN_STATUSES.completed ||
    status === WORKFLOW_RUN_STATUSES.skipped
  );
}

export function isValidAutomationPhoneNumber(value: string) {
  return AUTOMATION_PHONE_NUMBER_REGEX.test(value);
}
