import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Prisma, PrismaClient } from "@prisma/client";

import { getAppConfig } from "@/config/configuration";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: ["warn", "error"],
    });
  }

  async onModuleInit() {
    await this.$connect();
    const config = getAppConfig();
    this.logger.log(
      `Database adapter ready for ${config.database.provider}://${config.database.host}:${config.database.port}/${config.database.name}`,
    );
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  private isReconnectableError(error: unknown) {
    return (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      ["P1001", "P1008", "P1017"].includes(error.code)
    );
  }

  async executeWithReconnect<T>(
    operationName: string,
    operation: () => Promise<T>,
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (!this.isReconnectableError(error)) {
        throw error;
      }

      this.logger.warn(
        `Prisma operation "${operationName}" lost its DB connection. Retrying once after reconnect.`,
      );

      try {
        await this.$disconnect();
      } catch {
        // Ignore disconnect failures during reconnect attempts.
      }

      await this.$connect();
      return operation();
    }
  }
}
