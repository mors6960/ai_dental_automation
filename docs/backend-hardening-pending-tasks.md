# Backend Hardening Pending Tasks

## Current Verified State

The core backend automation happy path is working and manually verified for:

- `booking_confirmation`
- `lead_followup`
- `review_request`

Verified outcomes so far:

- MySQL persistence is working
- Redis + BullMQ queue wiring is working
- outbox events are being created and published
- workflow runs are being persisted
- reminders are being created and transitioned correctly on success
- lead follow-up creates `Conversation`, `Message`, and `LeadActivity`
- review request creates `ReviewRequest` and marks workflow complete

## Next Best Step

Move into the backend hardening phase.

Primary goals:

1. Verify failure cases for:
   - `booking_confirmation`
   - `lead_followup`
   - `review_request`
2. Add duplicate/concurrency hardening coverage
3. Fix `duplicateOfLeadId` bug in lead creation/dedup flow
4. Integrate a real WhatsApp provider
5. Add test coverage

## Immediate Hardening Tasks

These should be handled first:

1. Invalid phone number handling
   - verify each workflow marks the run as `SKIPPED` or `FAILED` as intended
   - confirm no message/reminder is sent
   - confirm status reason is stored

2. Unsupported channel handling
   - verify non-WhatsApp channels do not break workflows
   - confirm workflow/reminder/request is marked `SKIPPED`
   - confirm monitoring does not treat unsupported v1 channels as a false failure

3. Duplicate event replay handling
   - replay the same event/job
   - confirm no duplicate confirmation, follow-up, or review request is sent
   - verify idempotency constraints behave correctly

## Pending Functional Fixes

### 1. `duplicateOfLeadId` Bug

Observed issue:

- lead create response is returning `duplicateOfLeadId` equal to the same lead id

Required work:

- inspect dedup logic in leads repository/service
- determine whether duplicate matching is incorrectly self-linking
- prevent self-referential duplicate assignment
- add regression coverage

### 2. Booking Confirmation Failure Path Validation

Pending checks:

- invalid/missing phone
- unsupported channel
- retryable provider failure
- final failure after retry exhaustion
- duplicate replay
- concurrent duplicate job execution

### 3. Lead Follow-up Failure Path Validation

Pending checks:

- invalid/missing phone
- duplicate follow-up suppression
- repeated lead create event replay
- workflow state transition correctness
- `LeadActivity` correctness for skipped/failed cases

### 4. Review Request Failure Path Validation

Pending checks:

- invalid/missing phone
- unsupported channel
- repeated `appointment.completed` replay
- duplicate review request suppression
- retry/final failure behavior

## Real WhatsApp Provider Integration

Current state:

- mock + Twilio-compatible service boundary exists

Pending production work:

1. configure real provider credentials securely
2. verify outbound message delivery
3. persist provider message id
4. classify retryable vs non-retryable provider errors
5. add webhook handling for delivery/read/failure callbacks

## Test Coverage To Add

### Automation Workflow Tests

- `booking_confirmation` happy path
- `lead_followup` happy path
- `review_request` happy path

### Failure/Edge Case Tests

- invalid phone number
- unsupported channel
- duplicate replay
- retry exhaustion
- missing related entity

### Concurrency/Idempotency Tests

- same event processed twice
- same event processed concurrently
- DB uniqueness prevents duplicate reminder/review request creation
- workflow run idempotency remains stable across retries

## Recommended Execution Order

1. fix `duplicateOfLeadId`
2. verify invalid phone handling
3. verify unsupported channel handling
4. verify duplicate event replay behavior
5. add concurrency/idempotency hardening tests
6. wire real WhatsApp provider
7. add automated workflow tests

