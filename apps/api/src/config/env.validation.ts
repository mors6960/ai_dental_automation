export function validateEnv() {
  const requiredKeys = [
    "WEB_URL",
    "ADMIN_URL",
    "API_URL",
    "DB_PROVIDER",
    "DB_HOST",
    "DB_PORT",
    "DB_NAME",
    "DB_USER",
    "DB_PASSWORD",
    "DB_ROOT_PASSWORD",
    "DATABASE_URL",
    "DIRECT_URL",
    "REDIS_HOST",
    "REDIS_PORT",
    "JWT_SECRET",
    "REFRESH_TOKEN_SECRET",
    "CORS_ORIGIN",
    "N8N_BASE_URL",
    "N8N_WEBHOOK_SECRET",
    "N8N_LEAD_FOLLOWUP_WEBHOOK",
    "N8N_BOOKING_CONFIRMATION_WEBHOOK",
    "N8N_REVIEW_REQUEST_WEBHOOK",
  ];

  const missingKeys = requiredKeys.filter((key) => !process.env[key]);

  if (missingKeys.length > 0) {
    throw new Error(`Missing required environment keys: ${missingKeys.join(", ")}`);
  }

  return {
    PORT: Number(process.env.PORT ?? 3000),
    API_PREFIX: process.env.API_PREFIX ?? "api/v1",
  };
}
