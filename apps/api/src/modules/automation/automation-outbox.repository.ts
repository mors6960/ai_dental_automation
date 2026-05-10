import { Injectable } from "@nestjs/common";
import { AutomationOutboxStatus, Prisma } from "@prisma/client";

import { PrismaService } from "@/database/prisma.service";
import type { AutomationDomainEvent } from "@/modules/automation/automation.types";

@Injectable()
export class AutomationOutboxRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findPending(limit = 20) {
    return this.prisma.executeWithReconnect("automationOutboxEvent.findPending", () =>
      this.prisma.automationOutboxEvent.findMany({
        where: {
          status: {
            in: [AutomationOutboxStatus.PENDING, AutomationOutboxStatus.FAILED],
          },
        },
        orderBy: { createdAt: "asc" },
        take: limit,
      }),
    );
  }

  async findById(id: string) {
    return this.prisma.executeWithReconnect("automationOutboxEvent.findById", () =>
      this.prisma.automationOutboxEvent.findUnique({
        where: { id },
      }),
    );
  }

  async markPublished(id: string) {
    return this.prisma.executeWithReconnect("automationOutboxEvent.markPublished", () =>
      this.prisma.automationOutboxEvent.update({
        where: { id },
        data: {
          status: AutomationOutboxStatus.PUBLISHED,
          publishedAt: new Date(),
          publishAttempts: {
            increment: 1,
          },
          lastPublishError: null,
        },
      }),
    );
  }

  async markPublishFailed(id: string, errorMessage: string) {
    return this.prisma.executeWithReconnect("automationOutboxEvent.markPublishFailed", () =>
      this.prisma.automationOutboxEvent.update({
        where: { id },
        data: {
          status: AutomationOutboxStatus.FAILED,
          publishAttempts: {
            increment: 1,
          },
          lastPublishError: errorMessage,
        },
      }),
    );
  }

  toDomainEvent(record: {
    id: string;
    eventName: string;
    clinicId: string;
    entityType: string;
    entityId: string;
    createdAt: Date;
    payload: Prisma.JsonValue;
  }): AutomationDomainEvent {
    return {
      id: record.id,
      eventName: record.eventName,
      clinicId: record.clinicId,
      entityType: record.entityType,
      entityId: record.entityId,
      occurredAt: record.createdAt.toISOString(),
      payload:
        record.payload && typeof record.payload === "object" && !Array.isArray(record.payload)
          ? (record.payload as Record<string, unknown>)
          : {},
    };
  }
}
