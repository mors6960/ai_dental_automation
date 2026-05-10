import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { executeControllerAction } from "@/common/utils/response.util";

import { CALENDAR_MODULE } from "@/modules/calendar/constants/calendar.constants";
import { CalendarService } from "@/modules/calendar/calendar.service";
import { BookCalendarSlotDto } from "@/modules/calendar/dto/book-calendar-slot.dto";
import { CalendarSlotsQueryDto } from "@/modules/calendar/dto/calendar-slots-query.dto";

@ApiTags("Calendar")
@Controller(CALENDAR_MODULE.controller)
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get("slots")
  @ApiOperation({ summary: "Fetch available calendar slots" })
  @ApiOkResponse({ description: "Calendar slots fetched successfully." })
  async findSlots(@Query() query: CalendarSlotsQueryDto) {
    return executeControllerAction(() => this.calendarService.findSlots(query));
  }

  @Post("book")
  @ApiOperation({ summary: "Book a calendar slot" })
  @ApiOkResponse({ description: "Calendar slot booked successfully." })
  async bookSlot(@Body() payload: BookCalendarSlotDto) {
    return executeControllerAction(() => this.calendarService.bookSlot(payload));
  }
}
