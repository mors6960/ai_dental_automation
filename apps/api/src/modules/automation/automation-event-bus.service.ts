import { Injectable, Logger } from "@nestjs/common";
import { randomUUID } from "node:crypto";

import { AutomationQueueService } from "@/modules/automation/automation-queue.service";
import type { AutomationDomainEvent } from "@/modules/automation/automation.types";

@Injectable()
export class AutomationEventBusService {
  private readonly logger = new Logger(AutomationEventBusService.name);

  constructor(private readonly automationQueueService: AutomationQueueService) {}

  async publish<TPayload extends Record<string, unknown> = Record<string, unknown>>(
    event: AutomationDomainEvent<TPayload>,
  ) {
    const eventWithId = {
      ...event,
      id: event.id || randomUUID(),
    };

    this.logger.log(
      `Queueing automation event ${eventWithId.eventName} for ${eventWithId.entityType}:${eventWithId.entityId}`,
    );
    await this.automationQueueService.enqueue(eventWithId);
  }
}
