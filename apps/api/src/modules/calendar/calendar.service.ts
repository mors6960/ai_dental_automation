import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { createServicePayload, executeServiceAction } from "@/common/utils/response.util";

import { CALENDAR_ERROR_MESSAGES } from "@/modules/calendar/constants/calendar-error-messages";
import { CALENDAR_SUCCESS_MESSAGES } from "@/modules/calendar/constants/calendar-success-messages";
import { BookCalendarSlotDto } from "@/modules/calendar/dto/book-calendar-slot.dto";
import { CalendarSlotsQueryDto } from "@/modules/calendar/dto/calendar-slots-query.dto";

@Injectable()
export class CalendarService {
  async findSlots(query: CalendarSlotsQueryDto) {
    return executeServiceAction({
      fallbackMessage: CALENDAR_ERROR_MESSAGES.slotsFailed,
      action: () => {
      const date = query.date ?? new Date().toISOString().slice(0, 10);
      const slots = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"].map((time) => ({
        slot: `${date}T${time}:00.000Z`,
        service: query.service ?? "General Consultation",
        available: true,
      }));

      return createServicePayload(CALENDAR_SUCCESS_MESSAGES.slots, slots);
      },
    });
  }

  async bookSlot(payload: BookCalendarSlotDto) {
    return executeServiceAction({
      fallbackMessage: CALENDAR_ERROR_MESSAGES.bookFailed,
      action: () => {
      const booking = {
        id: randomUUID(),
        slot: payload.slot,
        patientName: payload.patientName,
        phone: payload.phone,
        bookedAt: new Date().toISOString(),
      };
      return createServicePayload(CALENDAR_SUCCESS_MESSAGES.booked, booking);
      },
    });
  }
}
