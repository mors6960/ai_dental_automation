import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";

import { AppConfigModule } from "@/config/config.module";
import { LoggingMiddleware } from "@/common/middleware/logging.middleware";
import { RequestMetaMiddleware } from "@/common/middleware/request-meta.middleware";
import { DecryptRequestMiddleware } from "@/common/middleware/decrypt-request.middleware";
import { EncryptionService } from "@/common/services/encryption.service";
import { DatabaseModule } from "@/database/database.module";
import { AutomationModule } from "@/modules/automation/automation.module";
import { AppointmentsModule } from "@/modules/appointments/appointments.module";
import { AdminModule } from "@/modules/admin/admin.module";
import { AuthModule } from "@/modules/auth/auth.module";
import { CalendarModule } from "@/modules/calendar/calendar.module";
import { ChatbotModule } from "@/modules/chatbot/chatbot.module";
import { HealthModule } from "@/modules/health/health.module";
import { LeadsModule } from "@/modules/leads/leads.module";
import { ReviewsModule } from "@/modules/reviews/reviews.module";
import { UsersModule } from "@/modules/users/users.module";
import { WhatsappModule } from "@/modules/whatsapp/whatsapp.module";

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    AutomationModule,
    HealthModule,
    AdminModule,
    AuthModule,
    UsersModule,
    LeadsModule,
    AppointmentsModule,
    ChatbotModule,
    WhatsappModule,
    ReviewsModule,
    CalendarModule,
  ],
  providers: [EncryptionService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware, RequestMetaMiddleware, DecryptRequestMiddleware)
      .forRoutes("*");
  }
}
