export type AutomationInitiatorType = "system" | "user" | "patient" | "webhook";

export type AutomationDomainEvent<TPayload = Record<string, unknown>> = {
  id: string;
  eventName: string;
  clinicId: string;
  entityType: string;
  entityId: string;
  occurredAt: string;
  initiatedBy?: {
    type: AutomationInitiatorType;
    id?: string;
  };
  payload: TPayload;
};

export type WorkflowRunRecord = {
  id: string;
  eventId?: string;
  workflowName: string;
  triggerEvent: string;
  clinicId: string;
  entityType: string;
  entityId: string;
  idempotencyKey: string;
  status: string;
  attemptCount: number;
  payloadMetadata?: Record<string, unknown>;
  statusReason?: string;
  lastError?: string;
  lastAttemptedAt?: string;
  startedAt: string;
  completedAt?: string;
  failedAt?: string;
  skippedAt?: string;
};

export type AutomationJobData = {
  eventId: string;
  eventName: string;
  clinicId: string;
  entityId: string;
  event?: AutomationDomainEvent;
};

export type AutomationExecutionContext = {
  attemptNumber: number;
  maxAttempts: number;
  jobId?: string;
};
