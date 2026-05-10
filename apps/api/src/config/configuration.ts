import { APP_DEFAULTS } from "@/common/constants/app.constants";
import { AUTOMATION_N8N_WEBHOOKS, AUTOMATION_QUEUE } from "@/modules/automation/automation.constants";

export function getAppConfig() {
  return {
    app: {
      name: process.env.APP_NAME ?? APP_DEFAULTS.appName,
      version: process.env.APP_VERSION ?? APP_DEFAULTS.appVersion,
      nodeEnv: process.env.NODE_ENV ?? "development",
      port: Number(process.env.PORT ?? APP_DEFAULTS.port),
      apiPrefix: process.env.API_PREFIX ?? APP_DEFAULTS.apiPrefix,
    },
    urls: {
      web: process.env.WEB_URL ?? APP_DEFAULTS.webUrl,
      admin: process.env.ADMIN_URL ?? APP_DEFAULTS.adminUrl,
      api: process.env.API_URL ?? APP_DEFAULTS.apiUrl,
      phpMyAdmin: `http://${APP_DEFAULTS.phpMyAdminHost}:${Number(process.env.PHPMYADMIN_PORT ?? APP_DEFAULTS.phpMyAdminPort)}`,
    },
    cors: {
      origin: (process.env.CORS_ORIGIN ?? `${APP_DEFAULTS.webUrl},${APP_DEFAULTS.adminUrl}`)
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean),
    },
    database: {
      provider: process.env.DB_PROVIDER ?? APP_DEFAULTS.dbProvider,
      host: process.env.DB_HOST ?? APP_DEFAULTS.dbHost,
      port: Number(process.env.DB_PORT ?? APP_DEFAULTS.dbPort),
      name: process.env.DB_NAME ?? APP_DEFAULTS.dbName,
      user: process.env.DB_USER ?? "",
      password: process.env.DB_PASSWORD ?? "",
      rootPassword: process.env.DB_ROOT_PASSWORD ?? "",
      url: process.env.DATABASE_URL ?? "",
      directUrl: process.env.DIRECT_URL ?? "",
    },
    redis: {
      host: process.env.REDIS_HOST ?? "127.0.0.1",
      port: Number(process.env.REDIS_PORT ?? 6379),
      password: process.env.REDIS_PASSWORD ?? "",
      db: Number(process.env.REDIS_DB ?? 0),
      queuePrefix: process.env.REDIS_QUEUE_PREFIX ?? AUTOMATION_QUEUE.redisPrefix,
    },
    whatsapp: {
      provider: process.env.WHATSAPP_PROVIDER ?? "mock",
      fromNumber: process.env.WHATSAPP_FROM_NUMBER ?? "",
      twilioAccountSid: process.env.TWILIO_ACCOUNT_SID ?? "",
      twilioAuthToken: process.env.TWILIO_AUTH_TOKEN ?? "",
      twilioApiBaseUrl: process.env.TWILIO_API_BASE_URL ?? APP_DEFAULTS.twilioApiBaseUrl,
    },
    n8n: {
      baseUrl: process.env.N8N_BASE_URL ?? APP_DEFAULTS.n8nBaseUrl,
      webhookSecret: process.env.N8N_WEBHOOK_SECRET ?? "",
      leadFollowupWebhookPath:
        process.env.N8N_LEAD_FOLLOWUP_WEBHOOK ?? AUTOMATION_N8N_WEBHOOKS.leadFollowup,
      bookingConfirmationWebhookPath:
        process.env.N8N_BOOKING_CONFIRMATION_WEBHOOK ?? AUTOMATION_N8N_WEBHOOKS.bookingConfirmation,
      reviewRequestWebhookPath:
        process.env.N8N_REVIEW_REQUEST_WEBHOOK ?? AUTOMATION_N8N_WEBHOOKS.reviewRequest,
      timeoutMs: Number(process.env.N8N_WEBHOOK_TIMEOUT_MS ?? APP_DEFAULTS.n8nWebhookTimeoutMs),
    },
    auth: {
      jwtSecret: process.env.JWT_SECRET ?? "",
      refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET ?? "",
      accessTokenTtl: process.env.ACCESS_TOKEN_TTL ?? APP_DEFAULTS.accessTokenTtl,
      refreshTokenTtlDays: Number(
        process.env.REFRESH_TOKEN_TTL_DAYS ?? APP_DEFAULTS.refreshTokenTtlDays,
      ),
    },
    security: {
      encryptionEnabled: process.env.ENABLE_ENCRYPTION === "true",
      encryptionSecretKey: process.env.ENCRYPTION_SECRET_KEY ?? "",
    },
    tenancy: {
      defaultClinicSlug:
        process.env.DEFAULT_CLINIC_SLUG ?? APP_DEFAULTS.defaultClinicSlug,
    },
  };
}
