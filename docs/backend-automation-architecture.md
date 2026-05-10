# Backend Automation Architecture

## Objective
Build a modular backend for an AI-powered dental automation system that:
- captures leads from landing page, chat, and WhatsApp
- converts leads into booked appointments
- sends confirmations and reminders automatically
- runs review and re-engagement workflows
- keeps a clean audit trail for every automation step

This document defines the backend architecture before implementation work expands further.

---

## System Goal

The backend should act as the automation brain of the product, not just a CRUD API.

It must support:
- synchronous API requests
- asynchronous workflow execution
- scheduled jobs
- external integrations
- lead and appointment lifecycle tracking
- event-driven automation triggers

---

## Core Architecture Principles

### 1. Modular By Business Capability
Each business domain should live in its own NestJS module.

Examples:
- `leads`
- `appointments`
- `chatbot`
- `whatsapp`
- `reviews`
- `calendar`
- `auth`

### 2. Workflows Triggered By Domain Events
Automations should not be hardcoded inside controllers.

Instead:
- controller accepts request
- service performs domain action
- domain action emits internal event
- automation handler reacts to that event

### 3. Keep API Layer Thin
Controllers should only:
- validate input
- call service methods
- return shaped responses

Business logic should stay in services or workflow handlers.

### 4. Separate Immediate Actions From Background Actions
Examples:
- create lead now
- schedule reminder later
- send review request later

The request-response path should remain fast; follow-up automations should run asynchronously.

### 5. Every Automation Must Be Traceable
Every important automation step should be logged so clinic support and internal ops can answer:
- what happened
- when it happened
- which patient/lead it affected
- whether it succeeded or failed

---

## High-Level Backend Layers

## 1. API Layer
Responsibility:
- receive HTTP requests
- validate DTOs
- authenticate where needed
- delegate to services

Current examples:
- leads controller
- appointments controller
- chatbot controller
- whatsapp controller

## 2. Domain Layer
Responsibility:
- business rules
- lifecycle transitions
- status changes
- orchestration of repositories and integrations

This is where:
- lead becomes booked
- appointment becomes completed
- review flow becomes eligible

## 3. Persistence Layer
Responsibility:
- database access
- query composition
- record creation and updates

Current implementation style:
- Prisma schema in `packages/db`
- repository classes in module folders

## 4. Integration Layer
Responsibility:
- external providers
- OpenAI
- Twilio / WhatsApp
- Google Calendar
- Calendly

These providers should stay isolated behind clear service contracts.

## 5. Automation Layer
Responsibility:
- trigger workflows
- run delayed actions
- schedule reminders
- route post-appointment follow-ups

This layer should become the main engine for automation behavior.

## 6. Observability Layer
Responsibility:
- audit logs
- workflow event logs
- webhook event logs
- job success/failure tracking

---

## Recommended Module Map

## Existing Domain Modules
- `auth`
- `users`
- `leads`
- `appointments`
- `chatbot`
- `whatsapp`
- `reviews`
- `calendar`
- `admin`
- `health`

## Recommended New Modules

### `automation`
Central workflow orchestration module.

Responsibilities:
- dispatch domain events
- resolve automation handlers
- start workflow runs
- record workflow execution history

### `scheduler`
Responsible for delayed and recurring jobs.

Responsibilities:
- enqueue reminder jobs
- enqueue review follow-up jobs
- retry failed sends
- cancel outdated jobs

### `templates`
Stores reusable message templates.

Responsibilities:
- confirmation messages
- reminder messages
- review request messages
- missed lead recovery messages

### `events`
Optional internal abstraction for domain events if automation volume grows.

### `integrations`
Can remain as providers for now, but should eventually expose clean interfaces:
- messaging adapter
- calendar adapter
- AI adapter

---

## Key Domain Flows

## 1. Lead Capture Flow

### Sources
- website form
- AI web chat
- WhatsApp inbound message
- manual staff entry

### Flow
1. receive inquiry
2. normalize payload
3. create lead
4. set `LeadSource`
5. emit `lead.created`
6. trigger automation sequence

### Outputs
- lead record
- conversation record if applicable
- optional internal notification
- optional follow-up workflow run

---

## 2. Booking Flow

### Trigger Sources
- website booking form
- AI chat booking intent
- WhatsApp booking intent
- manual admin booking

### Flow
1. collect patient + slot information
2. validate slot availability
3. create appointment
4. update lead status to `BOOKED` if linked
5. emit `appointment.created`
6. send confirmation
7. create reminder jobs

### Outputs
- appointment record
- appointment status history
- reminder queue entries

---

## 3. Reminder Flow

### Trigger
Scheduled relative to appointment time.

### Flow
1. scheduler picks due reminder
2. resolve preferred channel
3. send message
4. mark reminder status
5. emit success/failure event

### Common Rules
- only confirmed appointments should receive reminders
- cancelled appointments should invalidate pending reminder jobs
- reminder retries should be controlled and logged

---

## 4. Review Flow

### Trigger
Appointment marked `COMPLETED`.

### Flow
1. emit `appointment.completed`
2. create review request job
3. send feedback prompt after delay
4. branch by response sentiment
5. send Google review CTA for positive responses
6. route negative responses to clinic follow-up

### Outputs
- review request record
- delivery history
- optional review record

---

## 5. Missed Lead Recovery Flow

### Trigger
Lead remains unbooked for a configured period.

### Flow
1. lead created
2. no booking within threshold
3. send first follow-up
4. wait configured delay
5. send second follow-up
6. stop if booked or manually closed

---

## Automation Model

## Core Concept
Every major business action should emit an internal automation event.

Examples:
- `lead.created`
- `lead.qualified`
- `appointment.created`
- `appointment.rescheduled`
- `appointment.cancelled`
- `appointment.completed`
- `review.positive_received`

## Suggested Internal Workflow Pattern

### Domain Service
Performs business update.

### Event Publisher
Publishes internal event payload.

### Automation Handler
Consumes event and creates follow-up tasks.

### Scheduler / Job Runner
Executes delayed tasks later.

---

## Suggested Internal Event Payload Shape

```ts
type DomainEvent<TPayload> = {
  eventName: string;
  entityType: string;
  entityId: string;
  clinicId: string;
  occurredAt: string;
  payload: TPayload;
};
```

Example:

```ts
{
  eventName: "appointment.created",
  entityType: "appointment",
  entityId: "appt_123",
  clinicId: "clinic_123",
  occurredAt: "2026-05-09T12:00:00.000Z",
  payload: {
    patientId: "patient_123",
    source: "CHATBOT",
    appointmentTime: "2026-05-10T10:00:00.000Z"
  }
}
```

---

## Data Ownership Guidance

## Module Ownership

### Leads Module Owns
- lead creation
- lead status updates
- lead assignment
- source normalization

### Appointments Module Owns
- appointment creation
- appointment status transitions
- appointment history

### Chatbot Module Owns
- chat session lifecycle
- message persistence
- intent extraction

### WhatsApp Module Owns
- send operations
- delivery status processing
- inbound webhook handling

### Reviews Module Owns
- review request lifecycle
- response routing
- public review prompting

### Calendar Module Owns
- slot fetch
- provider sync behavior

### Automation Module Owns
- workflow runs
- trigger mapping
- delayed action registration
- automation event logging

---

## Recommended New Tables

The Prisma schema already includes many core business tables. For robust automation, consider adding:

### `WorkflowRun`
Purpose:
- one record per automation execution

Suggested fields:
- id
- clinicId
- workflowName
- triggerEvent
- entityType
- entityId
- status
- startedAt
- completedAt
- failedAt
- failureReason

### `WorkflowStepRun`
Purpose:
- trace individual automation steps

Suggested fields:
- workflowRunId
- stepName
- status
- startedAt
- completedAt
- payloadSnapshot
- resultSnapshot

### `OutboundMessage`
Purpose:
- normalized outbound communication log

Suggested fields:
- channel
- templateName
- recipient
- relatedEntityType
- relatedEntityId
- providerMessageId
- status
- sentAt
- deliveredAt
- failedAt

### `InboundMessage`
Purpose:
- normalized inbound communication log

### `JobQueueRecord`
Optional if using DB-backed scheduling.

---

## Job and Scheduling Strategy

## MVP Option
Use simple scheduled jobs first.

Examples already present:
- `reminder.job.ts`
- `review-followup.job.ts`

### Suitable For MVP
- fixed reminders
- delayed review prompts
- missed lead follow-ups

## Recommended Evolution
Move toward a dedicated queue or scheduler abstraction when:
- retries matter
- workflow volume increases
- multiple clinics are active
- delivery guarantees matter

Possible future tools:
- BullMQ
- Temporal
- database-backed job scheduler

For now, keep abstraction simple but avoid hardcoding timing logic directly in controllers.

---

## Integration Boundaries

## OpenAI Provider
Use for:
- chat generation
- FAQ handling
- lead qualification extraction

Do not let controllers call provider directly.
Always route through chatbot or AI service layer.

## Twilio / WhatsApp Provider
Use for:
- message send
- webhook receipt
- status callback handling

## Google Calendar / Calendly Providers
Use for:
- availability lookup
- booking sync
- event confirmation

---

## API Design Guidance

## Public-Facing APIs
- lead capture endpoint
- booking endpoint
- chatbot session + message endpoints
- whatsapp webhook endpoints

## Internal / Admin APIs
- manual appointment creation
- lead reassignment
- workflow replay
- reminder retry
- review request resend

## Avoid
- mixing public chatbot logic with admin operations
- provider-specific payloads leaking into controllers

---

## Error Handling Rules

## Immediate Request Failures
Return clean API error if:
- input invalid
- required resource missing
- slot unavailable

## Background Automation Failures
Do not fail original request after domain action already succeeded.

Instead:
- log failure
- mark workflow step failed
- expose for retry

Example:
Appointment created successfully, but WhatsApp confirmation failed.

Correct behavior:
- appointment stays created
- reminder workflow logs failure
- staff can retry confirmation

---

## Security and Compliance Considerations

Because this system touches patient communication:
- minimize sensitive data in logs
- avoid storing raw secrets in code
- encrypt sensitive configuration where required
- validate webhook authenticity
- maintain audit trail for admin actions

For MVP:
- keep request/response encryption optional
- ensure auth-protected admin endpoints
- keep patient identifiers structured consistently

---

## Recommended Build Sequence

## Phase A — Foundation
1. finalize Prisma schema
2. connect MySQL
3. create seed-ready clinic baseline
4. confirm module wiring

## Phase B — Core Business APIs
1. lead capture API
2. appointment booking API
3. chatbot capture flow
4. calendar slot flow

## Phase C — Automation Engine MVP
1. add internal domain event publisher
2. add automation module
3. add reminder scheduling
4. add review follow-up scheduling

## Phase D — Messaging Reliability
1. outbound message log
2. inbound webhook normalization
3. retry and failure visibility

## Phase E — Operations Layer
1. workflow run visibility
2. admin replay tools
3. analytics hooks

---

## Best Immediate Next Task

From this architecture, the best first implementation task is:

### Step 1
Create a clean lead capture flow:
- DTO
- controller
- service
- repository
- `lead.created` event

### Step 2
Create appointment booking flow:
- slot validation
- appointment creation
- `appointment.created` event

### Step 3
Add automation module with first two handlers:
- booking confirmation handler
- reminder scheduling handler

This gives a strong vertical slice:
lead in -> appointment booked -> automation triggered

---

## Summary

This backend should evolve as:
- modular NestJS application
- Prisma-backed domain system
- event-triggered automation backend
- integration-friendly workflow platform for dental clinics

The architecture should optimize for:
- fast MVP shipping
- clean business boundaries
- safe automation growth
- later expansion into multi-clinic SaaS workflows
