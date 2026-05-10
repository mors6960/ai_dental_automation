import { Injectable } from "@nestjs/common";

import { SUCCESS_MESSAGES } from "@/common/constants/success-messages";
import { createServicePayload, executeServiceAction } from "@/common/utils/response.util";
import { getAppConfig } from "@/config/configuration";

@Injectable()
export class HealthService {
  async getHealthStatus() {
    return executeServiceAction({
      fallbackMessage: "Unable to fetch health status.",
      action: () => {
        const appConfig = getAppConfig();

        return createServicePayload(SUCCESS_MESSAGES.healthCheck, {
          status: "ok",
          service: appConfig.app.name,
          version: appConfig.app.version,
          environment: appConfig.app.nodeEnv,
          urls: appConfig.urls,
          database: {
            provider: appConfig.database.provider,
            host: appConfig.database.host,
            port: appConfig.database.port,
            name: appConfig.database.name,
          },
          uptimeSeconds: Number(process.uptime().toFixed(2)),
          timestamp: new Date().toISOString(),
        });
      },
    });
  }
}
