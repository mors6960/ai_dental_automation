import { OnWorkerEvent, Processor, WorkerHost } from "@nestjs/bullmq";
import { Injectable, Logger } from "@nestjs/common";
import type { Job } from "bullmq";

import { AUTOMATION_QUEUE } from "@/modules/automation/automation.constants";
import type { AutomationJobData } from "@/modules/automation/automation.types";
import { AutomationOutboxRepository } from "@/modules/automation/automation-outbox.repository";
import { WorkflowDispatcherService } from "@/modules/automation/workflow-dispatcher.service";

@Injectable()
@Processor(AUTOMATION_QUEUE.name, {
  concurrency: 10,
})
export class AutomationProcessor extends WorkerHost {
  private readonly logger = new Logger(AutomationProcessor.name);

  constructor(
    private readonly workflowDispatcherService: WorkflowDispatcherService,
    private readonly outboxRepository: AutomationOutboxRepository,
  ) {
    super();
  }

  async process(job: Job<AutomationJobData>) {
    const outboxEvent =
      job.data.event
        ? null
        : await this.outboxRepository.findById(job.data.eventId);

    if (!job.data.event && !outboxEvent) {
      throw new Error(`Missing automation event payload for job ${job.id}`);
    }

    const dispatchEvent = outboxEvent
      ? this.outboxRepository.toDomainEvent(outboxEvent)
      : job.data.event!;

    await this.workflowDispatcherService.dispatch(dispatchEvent, {
      attemptNumber: job.attemptsMade + 1,
      maxAttempts: job.opts.attempts ?? AUTOMATION_QUEUE.defaultJobAttempts,
      jobId: job.id?.toString(),
    });
  }

  @OnWorkerEvent("completed")
  onCompleted(job: Job<AutomationJobData>) {
    this.logger.log(`Completed automation job ${job.name} (${job.id})`);
  }

  @OnWorkerEvent("failed")
  onFailed(job: Job<AutomationJobData> | undefined, error: Error) {
    this.logger.error(
      `Automation job ${job?.name ?? "unknown"} (${job?.id ?? "unknown"}) failed: ${error.message}`,
    );
  }
}
