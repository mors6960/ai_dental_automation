
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
