import { Module } from "@nestjs/common";

import { CalendarController } from "@/modules/calendar/calendar.controller";
import { CalendarService } from "@/modules/calendar/calendar.service";

@Module({
  controllers: [CalendarController],
  providers: [CalendarService],
  exports: [CalendarService],
})
export class CalendarModule {}
