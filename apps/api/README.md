# AI Dental API

Modular NestJS backend scaffold for the AI Dental Automation MVP.

## Structure

- `src/config`: environment and app configuration
- `src/common`: shared constants, DTOs, interceptors, middleware, utils
- `src/database`: database connection and ORM services
- `src/integrations`: external providers like OpenAI, Twilio, Calendly
- `src/modules`: feature modules such as auth, leads, appointments, chatbot
- `src/jobs`: reminder and follow-up jobs
