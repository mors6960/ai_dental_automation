
# AI Dental Automation - Production Folder Structure

## Monorepo Architecture

```txt
ai-dental-automation/
│
├── apps/
│   ├── web/
│   ├── admin/
│   └── api/
│
├── services/
│   ├── ai-agent/
│   ├── whatsapp-service/
│   ├── calendar-service/
│   ├── review-service/
│   └── voice-service/
│
├── packages/
│   ├── db/
│   ├── types/
│   ├── config/
│   └── ui/
│
├── automations/
│   └── n8n/
│
├── docs/
├── infra/
├── scripts/
│
├── package.json
├── turbo.json
└── pnpm-workspace.yaml
```

---

# apps/web

## Purpose
Landing page + patient-facing frontend.

## Stack
- Next.js
- Tailwind CSS
- Framer Motion
- shadcn/ui

## Features
- Landing page
- AI chatbot
- Appointment booking
- Testimonials
- SEO pages
- WhatsApp CTA

---

# apps/admin

## Purpose
Clinic dashboard.

## Features
- Leads management
- Appointment management
- Review moderation
- Analytics
- Settings

---

# apps/api

## Purpose
Backend API service.

## Stack
- NestJS
- PostgreSQL/Supabase
- JWT Auth

## Modules
- auth
- leads
- appointments
- chatbot
- whatsapp
- reviews
- analytics

---

# services/ai-agent

## Purpose
AI receptionist/chatbot logic.

## Features
- OpenAI prompts
- FAQ handling
- Lead qualification
- Appointment guidance
- AI responses

---

# services/whatsapp-service

## Purpose
WhatsApp automation.

## Integrations
- Twilio
- Meta WhatsApp API

## Features
- Booking confirmations
- Reminders
- Review requests
- Follow-ups

---

# services/calendar-service

## Purpose
Calendar integrations.

## Integrations
- Google Calendar
- Calendly

## Features
- Appointment scheduling
- Slot availability
- Calendar sync

---

# services/review-service

## Purpose
Review automation system.

## Features
- WhatsApp review collection
- Auto testimonials
- Low-rating alerts
- Review moderation

---

# services/voice-service

## Purpose
AI voice receptionist.

## Integrations
- Vapi
- Twilio Voice
- ElevenLabs

## Features
- AI call answering
- Voice appointment booking
- AI call routing

---

# packages/db

## Purpose
Database layer.

## Recommended
Supabase/PostgreSQL

## Tables
- leads
- appointments
- feedback
- users
- chatbot_messages

---

# packages/types

## Purpose
Shared TypeScript types.

## Example
- Lead
- Appointment
- Feedback
- User

---

# packages/ui

## Purpose
Reusable UI components.

## Components
- Buttons
- Cards
- Modals
- Inputs
- Chat UI

---

# automations/n8n

## Purpose
Workflow automation.

## Workflows
- lead-capture
- appointment-booking
- whatsapp-reminder
- review-request
- low-rating-alert

---

# infra/

## Purpose
Deployment and infrastructure.

## Includes
- Docker
- Vercel config
- Supabase config

---

# Recommended MVP Services

## Build FIRST

```txt
apps/web
apps/api
packages/db
services/ai-agent
services/whatsapp-service
services/calendar-service
services/review-service
automations/n8n
```

---

# Recommended Tech Stack

## Frontend
- Next.js
- Tailwind CSS
- Framer Motion

## Backend
- NestJS

## Database
- Supabase

## AI
- OpenAI API

## Voice AI
- Vapi
- ElevenLabs

## Automation
- n8n

## Hosting
- Vercel

## WhatsApp
- Twilio / Meta API

---

# Recommended MVP Flow

```txt
Landing Page
↓
AI Chat Assistant
↓
Appointment Booking
↓
Google Calendar
↓
WhatsApp Confirmation
↓
Review Automation
↓
Auto Testimonials
```

---

# Phase 1 Deliverables

## Price
$700 – $1500

## Includes
- Landing page
- AI chatbot
- Appointment booking
- WhatsApp automation
- Review automation
- SEO optimization

---

# Phase 2 Deliverables

## Price
$2000 – $5000

## Includes
- AI voice receptionist
- CRM automation
- Smart lead qualification
- Advanced analytics
- Automated follow-ups

---

# Long-Term Goal

Build an AI Automation Agency for appointment-based businesses.

---

# Recommended Modular Backend Structure (NestJS)

## apps/api Structure

```txt
apps/api/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   │
│   ├── config/
│   │   ├── configuration.ts
│   │   ├── env.validation.ts
│   │   └── config.module.ts
│   │
│   ├── common/
│   │   ├── constants/
│   │   │   ├── app.constants.ts
│   │   │   ├── error-messages.ts
│   │   │   └── success-messages.ts
│   │   │
│   │   ├── dto/
│   │   │   └── api-response.dto.ts
│   │   │
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   │
│   │   ├── interceptors/
│   │   │   ├── response.interceptor.ts
│   │   │   ├── response-time.interceptor.ts
│   │   │   └── encryption.interceptor.ts
│   │   │
│   │   ├── middleware/
│   │   │   ├── request-meta.middleware.ts
│   │   │   ├── logging.middleware.ts
│   │   │   └── decrypt-request.middleware.ts
│   │   │
│   │   ├── guards/
│   │   ├── pipes/
│   │   ├── utils/
│   │   │   ├── crypto.util.ts
│   │   │   ├── response.util.ts
│   │   │   └── time.util.ts
│   │   │
│   │   └── services/
│   │       └── encryption.service.ts
│   │
│   ├── database/
│   │   ├── database.module.ts
│   │   ├── prisma.service.ts
│   │   └── prisma/
│   │
│   ├── integrations/
│   │   ├── openai/
│   │   ├── twilio/
│   │   ├── calendly/
│   │   └── google-calendar/
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── constants/
│   │   │   │   ├── auth.constants.ts
│   │   │   │   ├── auth-error-messages.ts
│   │   │   │   └── auth-success-messages.ts
│   │   │   ├── dto/
│   │   │   ├── guards/
│   │   │   ├── strategies/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.repository.ts
│   │   │   └── auth.module.ts
│   │   │
│   │   ├── users/
│   │   ├── leads/
│   │   ├── appointments/
│   │   ├── chatbot/
│   │   ├── whatsapp/
│   │   ├── reviews/
│   │   ├── calendar/
│   │   └── health/
│   │
│   └── jobs/
│       ├── reminder.job.ts
│       └── review-followup.job.ts
│
└── test/
```

---

## Module Pattern Example

Each business module should stay self-contained.

```txt
modules/leads/
├── constants/
│   ├── leads.constants.ts
│   ├── leads-error-messages.ts
│   └── leads-success-messages.ts
├── dto/
├── leads.controller.ts
├── leads.service.ts
├── leads.repository.ts
└── leads.module.ts
```

Recommended first MVP modules:
- auth
- leads
- appointments
- chatbot
- whatsapp
- reviews
- health

---

## Standard API Response Shape

```json
{
  "success": true,
  "error": null,
  "message": "Appointment created successfully",
  "timestamp": "2026-05-09T07:00:00.000Z",
  "apiResponseTimeMs": 42,
  "data": {}
}
```

Error response:

```json
{
  "success": false,
  "error": {
    "code": "AUTH_INVALID_CREDENTIALS",
    "details": null
  },
  "message": "Invalid email or password",
  "timestamp": "2026-05-09T07:00:00.000Z",
  "apiResponseTimeMs": 42,
  "data": null
}
```

---

## Common Backend Flow

- `request-meta.middleware.ts` should capture request start time
- `response-time.interceptor.ts` should calculate API response time in milliseconds
- `response.interceptor.ts` should wrap all success responses in one standard format
- `http-exception.filter.ts` should normalize all errors into the same response shape
- `decrypt-request.middleware.ts` should decrypt incoming payloads if encryption is enabled
- `encryption.interceptor.ts` should encrypt outgoing responses if enabled via environment

---

## Environment-Driven Configuration

All secrets and runtime behavior should be controlled from `.env`

```env
NODE_ENV=development
PORT=3000

APP_NAME=ai-dental-api
APP_VERSION=1.0.0

DATABASE_URL=postgresql://...

JWT_SECRET=supersecret
JWT_EXPIRES_IN=7d

ENABLE_ENCRYPTION=true
ENCRYPTION_SECRET_KEY=your-32-char-key
ENCRYPTION_IV=your-16-char-iv

OPENAI_API_KEY=...
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_WHATSAPP_NUMBER=...

GOOGLE_CALENDAR_CLIENT_ID=...
GOOGLE_CALENDAR_CLIENT_SECRET=...
```

---

## Why This Structure

- business logic remains modular and scalable
- constants/messages stay inside their own modules
- response handling remains consistent across the entire API
- encryption/decryption can be turned on or off via env
- integrations stay isolated from business modules
- easier to extend into a full SaaS backend later
