# Database Package

Central database package for the AI Dental Automation monorepo.

## Stack

- Prisma ORM
- MySQL (local)
- phpMyAdmin (local admin UI)

## Core entity coverage

- Clinics and clinic settings
- Users and refresh sessions
- Patients
- Leads and lead activities
- Service catalog
- Appointments and appointment status history
- Conversations and messages
- Reminders
- Review requests and reviews
- Integration connections
- Webhook events
- Audit logs

## Commands

```bash
pnpm --filter @ai-dental-automation/db prisma:generate
pnpm --filter @ai-dental-automation/db prisma:migrate:dev
pnpm --filter @ai-dental-automation/db prisma:studio
```
