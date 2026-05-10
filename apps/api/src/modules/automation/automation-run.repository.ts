import { Injectable } from "@nestjs/common";
import { AutomationWorkflowStatus, Prisma } from "@prisma/client";

import { PrismaService } from "@/database/prisma.service";
import { WORKFLOW_RUN_STATUSES } from "@/modules/automation/automation.constants";
import type { AutomationDomainEvent, WorkflowRunRecord } from "@/modules/automation/automation.types";

@Injectable()
export class AutomationRunRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createOrGetFromEvent(
    event: AutomationDomainEvent,
    workflowName: string,
  ): Promise<WorkflowRunRecord> {
    const idempotencyKey = `${event.id}:${event.entityType}:${event.entityId}:${workflowName}`;

    const existing = await this.prisma.automationWorkflowRun.findUnique({
      where: { idempotencyKey },
    });

    if (existing) {
      return this.map(existing);
    }

    try {
      const workflowRun = await this.prisma.automationWorkflowRun.create({
        data: {
          clinicId: event.clinicId,
          eventId: event.id,
          workflowName,
          triggerEvent: event.eventName,
          entityType: event.entityType,
          entityId: event.entityId,
          idempotencyKey,
          payloadMetadata: this.toNullableJson(event.payload),
        },
      });

      return this.map(workflowRun);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        const workflowRun = await this.prisma.automationWorkflowRun.findUniqueOrThrow({
          where: { idempotencyKey },
        });
        return this.map(workflowRun);
      }

      throw error;
    }
  }

  async update(id: string, partial: Partial<WorkflowRunRecord>) {
    const updated = await this.prisma.automationWorkflowRun.update({
      where: { id },
      data: {
        status: partial.status as AutomationWorkflowStatus | undefined,
        attemptCount: partial.attemptCount,
        payloadMetadata: this.toNullableJson(partial.payloadMetadata),
        statusReason: partial.statusReason,
        lastError: partial.lastError,
        lastAttemptedAt: partial.lastAttemptedAt ? new Date(partial.lastAttemptedAt) : undefined,
        completedAt: partial.completedAt ? new Date(partial.completedAt) : undefined,
        failedAt: partial.failedAt ? new Date(partial.failedAt) : undefined,
        skippedAt: partial.skippedAt ? new Date(partial.skippedAt) : undefined,
      },
    });

    return this.map(updated);
  }

  async findById(id: string) {
    const workflowRun = await this.prisma.automationWorkflowRun.findUnique({
      where: { id },
    });

    return workflowRun ? this.map(workflowRun) : null;
  }

  async incrementAttempt(id: string) {
    const updated = await this.prisma.automationWorkflowRun.update({
      where: { id },
      data: {
        attemptCount: {
          increment: 1,
        },
        lastAttemptedAt: new Date(),
        status: WORKFLOW_RUN_STATUSES.running,
      },
    });

    return this.map(updated);
  }

  private map(record: {
    id: string;
    eventId: string | null;
    workflowName: string;
    triggerEvent: string;
    clinicId: string;
    entityType: string;
    entityId: string;
    idempotencyKey: string;
    status: string;
    attemptCount: number;
    payloadMetadata: Prisma.JsonValue | null;
    statusReason: string | null;
    lastError: string | null;
    lastAttemptedAt: Date | null;
    startedAt: Date;
    completedAt: Date | null;
    failedAt: Date | null;
    skippedAt: Date | null;
  }): WorkflowRunRecord {
    return {
      id: record.id,
      eventId: record.eventId ?? undefined,
      workflowName: record.workflowName,
      triggerEvent: record.triggerEvent,
      clinicId: record.clinicId,
      entityType: record.entityType,
      entityId: record.entityId,
      idempotencyKey: record.idempotencyKey,
      status: record.status,
      attemptCount: record.attemptCount,
      payloadMetadata: this.jsonToRecord(record.payloadMetadata),
      statusReason: record.statusReason ?? undefined,
      lastError: record.lastError ?? undefined,
      lastAttemptedAt: record.lastAttemptedAt?.toISOString(),
      startedAt: record.startedAt.toISOString(),
      completedAt: record.completedAt?.toISOString(),
      failedAt: record.failedAt?.toISOString(),
      skippedAt: record.skippedAt?.toISOString(),
    };
  }

  private toNullableJson(value: Record<string, unknown> | undefined): Prisma.InputJsonValue | undefined {
    if (!value) {
      return undefined;
    }

    return value as Prisma.InputJsonValue;
  }

  private jsonToRecord(value: Prisma.JsonValue | null): Record<string, unknown> | undefined {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return undefined;
    }

    return value as Record<string, unknown>;
  }
}
