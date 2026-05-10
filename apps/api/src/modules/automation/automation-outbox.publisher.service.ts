import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";

import { AUTOMATION_QUEUE } from "@/modules/automation/automation.constants";
import { AutomationOutboxRepository } from "@/modules/automation/automation-outbox.repository";
import { AutomationQueueService } from "@/modules/automation/automation-queue.service";

@Injectable()
export class AutomationOutboxPublisherService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(AutomationOutboxPublisherService.name);
  private intervalId?: NodeJS.Timeout;

  constructor(
    private readonly outboxRepository: AutomationOutboxRepository,
    private readonly queueService: AutomationQueueService,
  ) {}

  onModuleInit() {
    this.intervalId = setInterval(() => {
      void this.publishPendingEvents().catch((error) => {
        const message =
          error instanceof Error ? error.message : "Unknown outbox publish loop error";
        this.logger.error(`Outbox publish loop failed: ${message}`);
      });
    }, AUTOMATION_QUEUE.publisherIntervalMs);
  }

  onModuleDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  async publishPendingEvents(limit = 20) {
    const events = await this.outboxRepository.findPending(limit);

    for (const event of events) {
      await this.publishEventById(event.id);
    }
  }

  async publishEventById(eventId: string) {
    const event = await this.outboxRepository.findById(eventId);

    if (!event || event.publishedAt) {
      return;
    }

    try {
      await this.queueService.enqueueOutboxEvent({
        eventId: event.id,
        eventName: event.eventName,
        clinicId: event.clinicId,
        entityId: event.entityId,
      });
      await this.outboxRepository.markPublished(event.id);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown outbox publish error";
      this.logger.error(`Unable to publish outbox event ${event.id}: ${message}`);
      try {
        await this.outboxRepository.markPublishFailed(event.id, message);
      } catch (markError) {
        const markMessage =
          markError instanceof Error ? markError.message : "Unknown outbox mark failure";
        this.logger.error(
          `Unable to persist failed status for outbox event ${event.id}: ${markMessage}`,
        );
      }
      throw error;
    }
  }
}
