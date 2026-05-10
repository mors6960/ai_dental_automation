# AI Dental MVP Build Status And Next Steps

## Purpose

This document tracks:

- what we planned to build for the MVP
- what has already been built and verified
- what is still pending
- what should be done next

This is the current working source of truth for MVP implementation progress.

## MVP Scope We Intended To Build

### Core backend platform

- database-backed dental operations backend
- lead capture flow
- appointment booking flow
- appointment status management
- patient records
- service catalog support
- activity/history tracking
- review request support
- reminder support

### Automation engine

- internal automation eventing
- outbox-based event persistence
- queue-backed workflow execution
- workflow run persistence
- booking confirmation workflow
- lead follow-up workflow
- review request workflow

### n8n orchestration layer

- `lead_followup` webhook workflow
- `booking_confirmation` webhook workflow
- `review_request` webhook workflow
- backend-to-n8n trigger integration
- shared webhook secret protection

### MVP behavior goals

- backend remains source of truth
- API requests should not fail if automation/n8n side fails
- workflows should return explicit success/failure responses
- logs should make failures easy to debug

## What Is Built And Verified

### Backend foundation

- MySQL-backed backend is running
- Prisma schema is synced
- seed/default clinic/service data exists
- Redis/BullMQ setup is working
- internal automation module is wired

### Lead flow

- `POST /api/v1/leads` works
- lead records persist correctly
- patient upsert works
- lead activity records are created
- backend internal `lead_followup` workflow has been verified

### Appointment flow

- `POST /api/v1/appointments` works
- appointment overlap validation works
- patient and service resolution works
- appointment status history works
- `PENDING -> CONFIRMED -> COMPLETED` flow works

### Internal backend automations

- `booking_confirmation` internal workflow is working
- `lead_followup` internal workflow is working
- `review_request` internal workflow is working
- workflow runs are persisted
- reminders/review request records are being created
- mock WhatsApp sends are being logged

### Backend to n8n integration

- backend now triggers n8n for:
  - `lead.created`
  - `appointment.created`
  - `appointment.completed`
- webhook secret header is sent from backend
- n8n failures do not break main API requests
- backend logging for n8n failures has been improved
- `success: false` n8n responses are now treated as failures in backend logs

### n8n workflows verified

#### `lead_followup`

- webhook receives payload
- header auth / secret protection works
- phone validation works
- success branch works
- phone-missing branch works
- proper JSON response works

#### `booking_confirmation`

- webhook receives payload
- header auth / secret protection works
- phone validation works
- success branch works
- phone-missing branch works
- proper JSON response works

#### `review_request`

- webhook receives payload
- header auth / secret protection works
- phone validation works
- success branch works
- phone-missing branch works
- proper JSON response works

## Current MVP Status

### Done for MVP core

- backend CRUD and persistence
- internal workflow engine
- outbox/queue/workflow-run flow
- n8n webhook workflows for 3 core events
- backend → n8n integration
- secret-protected workflow execution
- clear JSON webhook responses

### Done but still basic

- WhatsApp behavior is still mock/stub based
- n8n workflows currently validate/orchestrate but do not yet perform rich external actions

## What Is Still Pending

### n8n workflow action layer

- add real action node to `lead_followup`
- add real action node to `booking_confirmation`
- add real action node to `review_request`

Recommended first action:

- add `HTTP Request` node in the true branch
- call a backend callback/logging endpoint first
- later replace or extend with real provider integrations

### Real provider integration

- replace mock WhatsApp send with actual provider
- add provider credentials
- track provider message ids
- handle provider delivery failures

### Backend hardening

- duplicate lead logic bug (`duplicateOfLeadId`) still needs cleanup
- workflow concurrency and replay hardening still pending
- invalid phone / unsupported channel cases need broader automated verification
- more explicit monitoring/metrics can still be added

### Tests

- unit tests for workflow services
- integration tests for backend → n8n triggers
- duplicate/replay tests
- failure-path tests
- concurrency tests

## Recommended Next Steps

### Phase 1: finish n8n workflow action layer

1. add a real `HTTP Request` node to `review_request`
2. verify backend callback/logging from n8n
3. apply same pattern to `booking_confirmation`
4. apply same pattern to `lead_followup`

### Phase 2: tighten backend workflow hardening

1. fix duplicate lead behavior
2. validate unsupported-channel handling
3. validate invalid-phone handling
4. validate duplicate event replay behavior
5. validate concurrency behavior

### Phase 3: real external delivery

1. integrate actual WhatsApp provider
2. persist provider message ids
3. capture send/delivery/failure lifecycle

### Phase 4: automated tests

1. add backend service tests
2. add n8n integration verification tests where practical
3. add end-to-end regression coverage for lead and appointment flows

## Immediate Next Task

If continuing from current state, the best immediate next implementation is:

1. add a real `HTTP Request` action node to `review_request`
2. confirm successful callback/response path
3. reuse the same design in:
   - `booking_confirmation`
   - `lead_followup`

## Summary

The MVP backend foundation is now substantially built.

What is already working:

- backend APIs
- internal automation engine
- queue/outbox/workflow runs
- n8n workflows for core events
- backend → n8n integration

What remains is mostly hardening and real external action execution, not initial system setup.
