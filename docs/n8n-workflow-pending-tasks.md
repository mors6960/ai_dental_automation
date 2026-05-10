# n8n Workflow Pending Tasks

## Current Verified State

The following n8n workflows have been created and manually verified at the basic webhook-validation level:

- `lead_followup`
- `booking_confirmation`

Verified for both:

- webhook receives payload
- phone presence check works
- success branch works
- failure branch works
- JSON response is returned correctly through `Respond to Webhook`

## Current Workflow Scope

These workflows are currently acting as **validation/orchestration stubs**, not full production automations yet.

Right now they do:

- receive webhook payloads
- check whether a phone number exists
- normalize selected fields
- return success/failure response

They do **not** yet:

- send real WhatsApp messages
- update backend state
- log results back into app DB
- use secrets/auth
- implement retry/error handling

## Pending Work In Existing n8n Workflows

### 1. `lead_followup`

Pending tasks:

- add real outbound action node
  - WhatsApp send
  - or backend API callback
- add phone format validation, not only empty check
- add webhook authentication/secret
- add backend callback/logging step
- define production response contract
- activate workflow and switch from test URL to production webhook URL

### 2. `booking_confirmation`

Pending tasks:

- add real outbound confirmation action
  - WhatsApp send
  - or backend reminder API callback
- validate phone format
- optionally validate appointment/service fields
- add authentication/secret for webhook
- add backend callback/logging step
- activate workflow and use production webhook URL

## Next Workflow To Build

### 3. `review_request`

Recommended V1 structure:

- `Webhook`
- `If` phone exists
- `Set`
- `Respond to Webhook`

Suggested fields:

- `appointmentId`
- `patientName`
- `phone`
- `reviewLink`

After V1 validation flow:

- add real outbound review request action
- connect with backend review request lifecycle

## Common Pending Tasks Across All n8n Workflows

### Functional

- connect workflows to real actions
- connect workflows to backend callback/update endpoints
- move from test mode to active production mode

### Validation

- phone number format validation
- missing field handling
- unsupported channel handling where needed

### Security

- add webhook authentication or shared secret
- avoid exposing open public webhook endpoints without verification

### Reliability

- retry strategy for failed outbound actions
- timeout handling
- error response conventions
- idempotency handling if duplicate events are sent

### Observability

- add execution naming/labels where useful
- define what should be logged back to backend
- decide whether workflow result should update DB state

## Recommended Next Order

1. build `review_request` V1 webhook workflow
2. add real action node to `lead_followup`
3. add real action node to `booking_confirmation`
4. add webhook auth/secret protection
5. activate workflows and use production webhook URLs
6. add backend-to-n8n integration

