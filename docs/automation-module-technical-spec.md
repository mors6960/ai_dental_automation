# Automation Module Technical Spec

## Purpose
Define the technical design of the `automation` module for the AI Dental backend.

This spec turns the high-level architecture into an implementable module plan.

The automation module is responsible for:
- consuming internal domain events
- deciding which workflow should run
- recording workflow execution
- delegating delayed tasks to the scheduler layer
- keeping automation logic out of controllers

---

## Scope

This spec covers:
- module boundaries
- folder layout
- service responsibilities
- internal event contracts
- workflow handler interfaces
- scheduler integration points
- database table recommendations
- first implementation sequence

This spec does not yet implement:
- Redis
- BullMQ
- external orchestration engines

---

## Target Outcome

After implementing this module, the backend should be able to do flows like:

### Lead Flow
`POST /leads`
→ create lead
→ emit `lead.created`
→ automation module starts follow-up workflow

### Appointment Flow
`POST /appointments`
→ create appointment
→ emit `appointment.created`
→ automation module triggers:
- booking confirmation
- reminder scheduling

### Review Flow
appointment marked complete
→ emit `appointment.completed`
→ automation module triggers:
- review request scheduling

---

## Design Principles

### 1. Domain Modules Own Data, Automation Module Owns Reactions
Examples:
- `leads` creates a lead
- `automation` reacts to `lead.created`

### 2. Automation Module Does Not Replace Domain Services
It should not directly become the place where all business logic lives.

Instead:
- domain services own core business action
- automation module owns post-action workflows

### 3. Every Workflow Must Be Observable
Every automation run should be stored with:
- trigger event
- entity id
- status
- step results
- failure reason

### 4. Scheduler Must Be Replaceable
MVP can use a DB-backed scheduler or cron-based polling.
Later, Redis/BullMQ can replace scheduling internals without changing domain APIs.

---

## Recommended Folder Structure

Suggested new backend structure:

```txt
apps/api/src/modules/automation/
  automation.module.ts
  automation.service.ts
  automation.types.ts
  automation.constants.ts
  automation-event-bus.service.ts
  automation-run.repository.ts
  workflow-dispatcher.service.ts
  dto/
  handlers/
    lead-created.handler.ts
    appointment-created.handler.ts
    appointment-completed.handler.ts
    appointment-cancelled.handler.ts
    review-positive.handler.ts
  workflows/
    lead-followup.workflow.ts
    booking-confirmation.workflow.ts
    reminder.workflow.ts
    review-request.workflow.ts
  mappers/
    automation-event.mapper.ts
  interfaces/
    automation-handler.interface.ts
    workflow-step.interface.ts
```

If scheduler is introduced as a separate module:

```txt
apps/api/src/modules/scheduler/
  scheduler.module.ts
  scheduler.service.ts
  reminder-scheduler.service.ts
  review-scheduler.service.ts
```

---

## Module Responsibilities

## `automation.module.ts`
Registers:
- automation service
- event bus
- workflow dispatcher
- workflow handlers
- automation repositories

Imports:
- `DatabaseModule`
- optionally `SchedulerModule`
- optionally `WhatsappModule`
- optionally `ReviewsModule`

Exports:
- `AutomationService`
- `AutomationEventBusService`

---

## `automation.service.ts`
High-level application service for automation orchestration.

Responsibilities:
- start workflow run
- update workflow run status
- register step execution
- surface workflow utilities to handlers

Methods:
- `startWorkflow(...)`
- `completeWorkflow(...)`
- `failWorkflow(...)`
- `recordStepStart(...)`
- `recordStepSuccess(...)`
- `recordStepFailure(...)`

---

## `automation-event-bus.service.ts`
Internal event publisher/dispatcher abstraction.

Responsibilities:
- publish internal automation events
- fan out event to matching handlers
- isolate event dispatch mechanism from domain modules

This should be synchronous in MVP, but structured so it can evolve later.

Methods:
- `publish(event: AutomationDomainEvent<any>)`
- `register(...)` optional if dynamic registration is ever needed

---

## `workflow-dispatcher.service.ts`
Maps event names to handler classes.

Responsibilities:
- receive event
- find matching handlers
- execute each handler safely
- create workflow run records

Methods:
- `dispatch(event)`
- `resolveHandlers(eventName)`

---

## Handler Layer

Each handler reacts to one event type.

Examples:
- `LeadCreatedHandler`
- `AppointmentCreatedHandler`
- `AppointmentCompletedHandler`

Handler responsibilities:
- decide whether workflow should run
- collect needed context
- call domain-specific workflow or scheduler methods
- record execution outcome

Handlers should stay small and orchestration-focused.

---

## Workflow Layer

Workflow classes contain reusable automation sequences.

Examples:
- `LeadFollowupWorkflow`
- `BookingConfirmationWorkflow`
- `ReminderWorkflow`
- `ReviewRequestWorkflow`

Workflow responsibilities:
- define ordered automation steps
- delegate provider calls
- store structured step results
- stay independent from controller request flow

---

## Event Contract

## Base Event Type

```ts
export type AutomationDomainEvent<TPayload = Record<string, unknown>> = {
  eventName: string;
  clinicId: string;
  entityType: string;
  entityId: string;
  occurredAt: string;
  initiatedBy?: {
    type: "system" | "user" | "patient" | "webhook";
    id?: string;
  };
  payload: TPayload;
};
```

---

## Initial Event Names

### Lead Events
- `lead.created`
- `lead.updated`
- `lead.qualified`
- `lead.booked`

### Appointment Events
- `appointment.created`
- `appointment.updated`
- `appointment.confirmed`
- `appointment.rescheduled`
- `appointment.cancelled`
- `appointment.completed`

### Review Events
- `review-request.created`
- `review.positive-received`
- `review.negative-received`

### WhatsApp Events
- `whatsapp.message.received`
- `whatsapp.message.delivered`
- `whatsapp.message.failed`

---

## Initial Event Payloads

## `lead.created`

```ts
type LeadCreatedPayload = {
  leadId: string;
  source: "WEBSITE" | "CHATBOT" | "WHATSAPP" | "PHONE" | "MANUAL";
  fullName?: string;
  phone?: string;
  email?: string;
  message?: string;
};
```

## `appointment.created`

```ts
type AppointmentCreatedPayload = {
  appointmentId: string;
  patientId?: string;
  leadId?: string;
  source: "WEBSITE" | "CHATBOT" | "WHATSAPP" | "PHONE" | "MANUAL";
  scheduledAt: string;
  timezone: string;
};
```

## `appointment.completed`

```ts
type AppointmentCompletedPayload = {
  appointmentId: string;
  patientId: string;
  completedAt: string;
};
```

---

## Handler Interface

```ts
export interface AutomationHandler<TPayload = unknown> {
  eventName: string;
  handle(event: AutomationDomainEvent<TPayload>): Promise<void>;
}
```

Optional stronger version:

```ts
export interface AutomationHandler<TPayload = unknown> {
  supports(eventName: string): boolean;
  handle(event: AutomationDomainEvent<TPayload>): Promise<void>;
}
```

For MVP, the simple `eventName` property approach is enough.

---

## Workflow Run Model

Recommended new Prisma model:

```prisma
model WorkflowRun {
  id            String   @id @default(cuid())
  clinicId      String
  workflowName  String
  triggerEvent  String
  entityType    String
  entityId      String
  status        String
  startedAt     DateTime @default(now())
  completedAt   DateTime?
  failedAt      DateTime?
  failureReason String?
  payloadJson   Json?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

Recommended companion model:

```prisma
model WorkflowStepRun {
  id              String   @id @default(cuid())
  workflowRunId   String
  stepName        String
  status          String
  payloadJson     Json?
  resultJson      Json?
  failureReason   String?
  startedAt       DateTime @default(now())
  completedAt     DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

These are the minimum observability tables for automation tracing.

---

## Scheduler Integration

## MVP Scheduler Mode
Use scheduler as a separate service that inserts due actions into DB-backed records.

Example:
- `appointment.created`
→ handler triggers `scheduleConfirmationAndReminders`
→ scheduler creates reminder records with future `sendAt` timestamps

Then cron/job processors:
- scan due reminders
- send messages
- update status

This avoids needing Redis on day one.

---

## Future Queue Mode

Later, these scheduler calls can map to BullMQ jobs:
- `send-booking-confirmation`
- `send-reminder`
- `send-review-request`
- `send-missed-lead-followup`

The automation module should not depend directly on BullMQ-specific classes right now.

It should depend on an abstract scheduler service like:

```ts
export interface AutomationScheduler {
  scheduleReminder(input: ScheduleReminderInput): Promise<void>;
  scheduleReviewRequest(input: ScheduleReviewRequestInput): Promise<void>;
  scheduleLeadFollowup(input: ScheduleLeadFollowupInput): Promise<void>;
}
```

---

## Integration Contracts

Automation handlers/workflows should talk to abstractions, not raw providers.

Recommended interfaces:

### Messaging
```ts
interface MessagingService {
  sendWhatsappMessage(input: SendWhatsappMessageInput): Promise<SendMessageResult>;
  sendEmail?(input: SendEmailInput): Promise<SendMessageResult>;
}
```

### Calendar
```ts
interface CalendarSchedulingService {
  getAvailableSlots(input: GetAvailableSlotsInput): Promise<CalendarSlot[]>;
  createCalendarEvent(input: CreateCalendarEventInput): Promise<CalendarEventResult>;
}
```

### AI
```ts
interface AiAutomationService {
  classifyLeadIntent(input: LeadIntentInput): Promise<LeadIntentResult>;
  generateReply(input: ChatReplyInput): Promise<ChatReplyResult>;
}
```

---

## Required Changes In Existing Modules

## Leads Module

### Current State
`LeadsService.create()` creates the lead and returns response.

### Required Change
After successful lead creation:
- build domain event
- publish `lead.created`

Example target:

```ts
const lead = await this.leadsRepository.create(createLeadDto);

await this.automationEventBus.publish({
  eventName: "lead.created",
  clinicId: lead.clinicId,
  entityType: "lead",
  entityId: lead.id,
  occurredAt: new Date().toISOString(),
  payload: {
    leadId: lead.id,
    source: lead.source,
    fullName: lead.fullName,
    phone: lead.phone,
    email: lead.email,
    message: lead.message,
  },
});
```

## Appointments Module

### Required Change
After successful appointment creation:
- publish `appointment.created`

After cancel:
- publish `appointment.cancelled`

Later:
- when appointment status becomes completed
→ publish `appointment.completed`

---

## First Three Handlers To Build

## 1. `LeadCreatedHandler`
Purpose:
- start missed lead recovery flow
- optionally notify clinic

Actions:
- create workflow run
- create first follow-up schedule

## 2. `AppointmentCreatedHandler`
Purpose:
- send booking confirmation
- create reminders

Actions:
- create workflow run
- trigger immediate confirmation
- schedule reminder records

## 3. `AppointmentCompletedHandler`
Purpose:
- start review request flow

Actions:
- create workflow run
- schedule review request

---

## Suggested MVP Workflow Definitions

## Workflow: `booking_confirmation`

Trigger:
- `appointment.created`

Steps:
1. create workflow run
2. resolve patient contact channel
3. send WhatsApp confirmation
4. store outbound message result
5. schedule reminder jobs
6. mark workflow complete

## Workflow: `lead_followup`

Trigger:
- `lead.created`

Steps:
1. create workflow run
2. check if immediate contact info exists
3. create follow-up schedule
4. mark workflow complete

## Workflow: `review_request`

Trigger:
- `appointment.completed`

Steps:
1. create workflow run
2. delay send by configured hours
3. send feedback request
4. wait for response path

---

## Error Handling Strategy

## Handler Failure
If one handler fails:
- log workflow failure
- do not break original domain transaction retroactively

Example:
Appointment was created, but confirmation message failed.

Expected result:
- appointment remains created
- workflow run marked failed
- retry remains possible

## Step Failure
Each workflow step should write:
- status = failed
- failure reason
- provider response if available

---

## Retry Strategy

For MVP:
- manual retry support is enough
- retryable failures should remain visible in workflow records

Later:
- add exponential retry for network/provider errors
- max retry count
- dead-letter queue behavior if queue system added

---

## Security Notes

Automation logs should avoid unnecessarily storing:
- full sensitive message bodies unless needed
- secrets
- raw tokens

Safe to log:
- event names
- entity ids
- clinic ids
- timestamps
- status
- non-sensitive failure messages

---

## Technical Dependencies

### Immediate
- NestJS providers
- Prisma models
- existing domain modules

### Near Future
- scheduler abstraction
- DB-backed workflow tables

### Later
- Redis
- BullMQ
- template registry
- workflow admin replay endpoints

---

## Implementation Plan

## Phase 1 — Create Automation Skeleton
- create `automation.module.ts`
- create `automation.service.ts`
- create `automation-event-bus.service.ts`
- create handler interface
- wire into `AppModule`

## Phase 2 — Add Workflow Persistence
- add `WorkflowRun`
- add `WorkflowStepRun`
- create repositories
- record workflow executions

## Phase 3 — Publish First Events
- `lead.created`
- `appointment.created`
- `appointment.cancelled`

## Phase 4 — Build First Handlers
- `LeadCreatedHandler`
- `AppointmentCreatedHandler`
- `AppointmentCompletedHandler`

## Phase 5 — Add Scheduler Hooks
- create reminder scheduling abstraction
- create review scheduling abstraction
- connect to existing reminder/review jobs

---

## Best Immediate Build Task

The best first coding task after this spec is:

### Step 1
Create automation module skeleton and internal event bus

### Step 2
Update `LeadsService.create()` to publish `lead.created`

### Step 3
Update `AppointmentsService.create()` to publish `appointment.created`

### Step 4
Implement `AppointmentCreatedHandler` with placeholder confirmation/reminder behavior

This gives a working foundation without requiring Redis yet.

---

## Final Recommendation

Implement the automation module in this order:
- internal event publishing first
- workflow persistence second
- scheduler integration third
- queue/Redis later if delivery scale demands it

That path is the fastest way to get reliable automation without overengineering early.
