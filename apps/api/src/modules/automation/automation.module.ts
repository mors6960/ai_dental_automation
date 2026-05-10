import { BullModule } from "@nestjs/bullmq";
import { Global, Module } from "@nestjs/common";

import { getAppConfig } from "@/config/configuration";
import { AUTOMATION_QUEUE } from "@/modules/automation/automation.constants";
import { AutomationEventBusService } from "@/modules/automation/automation-event-bus.service";
import { AutomationMetricsService } from "@/modules/automation/automation-metrics.service";
import { AutomationOutboxPublisherService } from "@/modules/automation/automation-outbox.publisher.service";
import { AutomationOutboxRepository } from "@/modules/automation/automation-outbox.repository";
import { AutomationProcessor } from "@/modules/automation/automation.processor";
import { AutomationQueueService } from "@/modules/automation/automation-queue.service";
import { AutomationRunRepository } from "@/modules/automation/automation-run.repository";
import { AutomationController } from "@/modules/automation/automation.controller";
import { AutomationService } from "@/modules/automation/automation.service";
import { N8nWebhookService } from "@/modules/automation/n8n-webhook.service";
import { BookingConfirmationWorkflow } from "@/modules/automation/booking-confirmation.workflow";
import { AppointmentCompletedHandler } from "@/modules/automation/handlers/appointment-completed.handler";
import { AppointmentCreatedHandler } from "@/modules/automation/handlers/appointment-created.handler";
import { LeadCreatedHandler } from "@/modules/automation/handlers/lead-created.handler";
import { LeadFollowupWorkflow } from "@/modules/automation/lead-followup.workflow";
import { ReviewRequestWorkflow } from "@/modules/automation/review-request.workflow";
import { WorkflowDispatcherService } from "@/modules/automation/workflow-dispatcher.service";
import { ReviewsModule } from "@/modules/reviews/reviews.module";
import { WhatsappModule } from "@/modules/whatsapp/whatsapp.module";

@Global()
@Module({
  imports: [
    WhatsappModule,
    ReviewsModule,
    BullModule.forRootAsync({
      useFactory: () => {
        const config = getAppConfig().redis;

        return {
          connection: {
            host: config.host,
            port: config.port,
            password: config.password || undefined,
            db: config.db,
          },
          prefix: config.queuePrefix,
        };
      },
    }),
    BullModule.registerQueue({
      name: AUTOMATION_QUEUE.name,
      defaultJobOptions: {
        attempts: AUTOMATION_QUEUE.defaultJobAttempts,
        backoff: {
          type: "exponential",
          delay: AUTOMATION_QUEUE.defaultBackoffDelayMs,
        },
        removeOnComplete: AUTOMATION_QUEUE.removeOnComplete,
        removeOnFail: AUTOMATION_QUEUE.removeOnFail,
      },
    }),
  ],
  controllers: [AutomationController],
  providers: [
    AutomationRunRepository,
    AutomationOutboxRepository,
    AutomationService,
    AutomationEventBusService,
    AutomationMetricsService,
    N8nWebhookService,
    AutomationQueueService,
    AutomationOutboxPublisherService,
    AutomationProcessor,
    BookingConfirmationWorkflow,
    LeadFollowupWorkflow,
    ReviewRequestWorkflow,
    WorkflowDispatcherService,
    LeadCreatedHandler,
    AppointmentCreatedHandler,
    AppointmentCompletedHandler,
  ],
  exports: [
    AutomationService,
    AutomationEventBusService,
    AutomationOutboxPublisherService,
    N8nWebhookService,
  ],
})
export class AutomationModule {}
