import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import type { Queue } from "bullmq";

import { AUTOMATION_QUEUE } from "@/modules/automation/automation.constants";
import type { AutomationDomainEvent, AutomationJobData } from "@/modules/automation/automation.types";

@Injectable()
export class AutomationQueueService {
  private static toSafeJobId(value: string) {
    return value.replace(/[^a-zA-Z0-9_-]/g, "_");
  }

  constructor(
    @InjectQueue(AUTOMATION_QUEUE.name)
    private readonly automationQueue: Queue<AutomationJobData>,
  ) {}

  async enqueue<TPayload extends Record<string, unknown> = Record<string, unknown>>(
    event: AutomationDomainEvent<TPayload>,
  ) {
    return this.automationQueue.add(
      event.eventName,
      {
        eventId: event.id,
        eventName: event.eventName,
        clinicId: event.clinicId,
        entityId: event.entityId,
        event,
      },
      {
        jobId: AutomationQueueService.toSafeJobId(event.id),
      },
    );
  }

  async enqueueOutboxEvent(payload: AutomationJobData) {
    return this.automationQueue.add(payload.eventName, payload, {
      jobId: AutomationQueueService.toSafeJobId(payload.eventId),
    });
  }
}
