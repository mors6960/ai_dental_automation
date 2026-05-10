import { Module } from "@nestjs/common";

import { AppointmentsController } from "@/modules/appointments/appointments.controller";
import { AppointmentsRepository } from "@/modules/appointments/appointments.repository";
import { AppointmentsService } from "@/modules/appointments/appointments.service";

@Module({
  controllers: [AppointmentsController],
  providers: [AppointmentsRepository, AppointmentsService],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
