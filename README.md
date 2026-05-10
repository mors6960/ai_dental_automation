# AI Dental Automation

Monorepo scaffold for the AI-powered dental appointment and patient automation system.

## Top-Level Structure

- `apps/web`: patient-facing landing page and booking frontend
- `apps/admin`: clinic dashboard
- `apps/api`: backend API
- `services/*`: domain services for AI, WhatsApp, calendar, reviews, and voice
- `packages/*`: shared packages for database, types, config, and UI
- `automations/n8n`: workflow automations
- `docs`: business roadmap and production structure docs
- `infra`: deployment and infrastructure files
- `scripts`: helper scripts

## Environment

- Use one shared root environment file for the full monorepo.
- Copy [.env.example](/Users/mor/Work/ai-dental-automation/.env.example) to `.env`.
- Backend, frontend, integrations, and automation services should read from this shared env source.

## Database

- This project is intended to run against your machine-level shared Docker stack.
- Expected common services:
  - MySQL on `127.0.0.1:3306`
  - phpMyAdmin on `127.0.0.1:8084`
  - Redis on `127.0.0.1:6379`
- Prisma schema lives at [packages/db/prisma/schema.prisma](/Users/mor/Work/ai-dental-automation/packages/db/prisma/schema.prisma).
- The checked-in [infra/docker-compose.yml](/Users/mor/Work/ai-dental-automation/infra/docker-compose.yml) is only a fallback if you explicitly want isolated project-local infra.

Useful commands:

```bash
mysql -h127.0.0.1 -uroot -padmin123 -e "SHOW DATABASES;"
```

```bash
pnpm --filter @ai-dental-automation/db prisma:generate
pnpm --filter @ai-dental-automation/db prisma:migrate:dev
```

```bash
pnpm --filter @ai-dental-automation/api dev
```
