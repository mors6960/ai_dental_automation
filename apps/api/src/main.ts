import "reflect-metadata";

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { AppModule } from "@/app.module";
import { HttpExceptionFilter } from "@/common/filters/http-exception.filter";
import { EncryptionInterceptor } from "@/common/interceptors/encryption.interceptor";
import { ResponseInterceptor } from "@/common/interceptors/response.interceptor";
import { EncryptionService } from "@/common/services/encryption.service";
import { getAppConfig } from "@/config/configuration";
import { validateEnv } from "@/config/env.validation";

function loadRootEnv() {
  const envPath = resolve(__dirname, "../../../.env");

  if (!existsSync(envPath)) {
    return;
  }

  const envContent = readFileSync(envPath, "utf8");

  for (const rawLine of envContent.split("\n")) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();

    if (key) {
      process.env[key] = value;
    }
  }
}

async function bootstrap() {
  loadRootEnv();
  validateEnv();
  const appConfig = getAppConfig();

  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: appConfig.cors.origin,
      credentials: true,
    },
  });
  const logger = new Logger("Bootstrap");

  app.setGlobalPrefix(appConfig.app.apiPrefix);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(
    new ResponseInterceptor(),
    new EncryptionInterceptor(app.get(EncryptionService)),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle("AI Dental Automation API")
    .setDescription(
      "MVP backend docs for auth, leads, appointments, chatbot, WhatsApp, reviews, calendar, and health endpoints.",
    )
    .setVersion(appConfig.app.version)
    .addServer(appConfig.urls.api)
    .addTag("Health")
    .addTag("Auth")
    .addTag("Leads")
    .addTag("Appointments")
    .addTag("Chatbot")
    .addTag("WhatsApp")
    .addTag("Reviews")
    .addTag("Calendar")
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("docs", app, swaggerDocument, {
    customSiteTitle: "AI Dental API Docs",
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: "none",
    },
  });

  await app.listen(appConfig.app.port);
  logger.log(
    `${appConfig.app.name} running on ${appConfig.urls.api}/${appConfig.app.apiPrefix}/health`,
  );
  logger.log(`Swagger docs available at ${appConfig.urls.api}/docs`);
}

void bootstrap();
