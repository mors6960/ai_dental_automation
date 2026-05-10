export const AUTOMATION_MODULE = {
  name: "automation",
  controller: "automation",
} as const;

export const AUTOMATION_QUEUE = {
  name: "automation-events",
  redisPrefix: "ai-dental-automation",
  defaultJobAttempts: 5,
  defaultBackoffDelayMs: 5000,
  removeOnComplete: 500,
  removeOnFail: 1000,
  publisherIntervalMs: 10_000,
} as const;

export const AUTOMATION_EVENT_NAMES = {
  leadCreated: "lead.created",
  appointmentCreated: "appointment.created",
  appointmentCancelled: "appointment.cancelled",
  appointmentCompleted: "appointment.completed",
} as const;

export const WORKFLOW_RUN_STATUSES = {
  pending: "PENDING",
  running: "RUNNING",
  completed: "COMPLETED",
  failed: "FAILED",
  skipped: "SKIPPED",
} as const;

export const REMINDER_WORKFLOW_TEMPLATE_KEYS = {
  bookingConfirmation: "BOOKING_CONFIRMATION",
} as const;

export const REMINDER_WORKFLOW_REASONS = {
  unsupportedChannel: "unsupported_channel",
  missingTarget: "missing_target",
  invalidTarget: "invalid_target",
} as const;

export const AUTOMATION_WORKFLOW_NAMES = {
  leadFollowup: "lead_followup",
  bookingConfirmation: "booking_confirmation",
  reviewRequest: "review_request",
} as const;

export const AUTOMATION_N8N_WEBHOOKS = {
  leadFollowup: "/webhook/lead-followup",
  bookingConfirmation: "/webhook/booking-confirmation",
  reviewRequest: "/webhook/review-request",
} as const;

export const AUTOMATION_N8N_CALLBACKS = {
  leadFollowup: "lead_followup",
  bookingConfirmation: "booking_confirmation",
  reviewRequest: "review_request",
} as const;
