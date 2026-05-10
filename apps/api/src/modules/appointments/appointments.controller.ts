import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { executeControllerAction } from "@/common/utils/response.util";

import { APPOINTMENTS_MODULE } from "@/modules/appointments/constants/appointments.constants";
import { AppointmentsService } from "@/modules/appointments/appointments.service";
import { AppointmentsQueryDto } from "@/modules/appointments/dto/appointments-query.dto";
import { CancelAppointmentDto } from "@/modules/appointments/dto/cancel-appointment.dto";
import { CreateAppointmentDto } from "@/modules/appointments/dto/create-appointment.dto";
import { UpdateAppointmentDto } from "@/modules/appointments/dto/update-appointment.dto";

@ApiTags("Appointments")
@Controller(APPOINTMENTS_MODULE.controller)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @ApiOperation({ summary: "Create a new appointment" })
  @ApiOkResponse({ description: "Appointment created successfully." })
  async create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return executeControllerAction(() => this.appointmentsService.create(createAppointmentDto));
  }

  @Get()
  @ApiOperation({ summary: "Fetch all appointments with optional filters" })
  @ApiOkResponse({ description: "Appointments fetched successfully." })
  async findAll(@Query() query: AppointmentsQueryDto) {
    return executeControllerAction(() => this.appointmentsService.findAll(query));
  }

  @Get(":id")
  @ApiOperation({ summary: "Fetch appointment details by id" })
  @ApiOkResponse({ description: "Appointment details fetched successfully." })
  async findOne(@Param("id") id: string) {
    return executeControllerAction(() => this.appointmentsService.findOne(id));
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update an appointment by id" })
  @ApiOkResponse({ description: "Appointment updated successfully." })
  async update(@Param("id") id: string, @Body() updateAppointmentDto: UpdateAppointmentDto) {
    return executeControllerAction(() =>
      this.appointmentsService.update(id, updateAppointmentDto),
    );
  }

  @Post(":id/cancel")
  @ApiOperation({ summary: "Cancel an appointment by id" })
  @ApiOkResponse({ description: "Appointment cancelled successfully." })
  async cancel(@Param("id") id: string, @Body() cancelAppointmentDto: CancelAppointmentDto) {
    return executeControllerAction(() =>
      this.appointmentsService.cancel(id, cancelAppointmentDto),
    );
  }
}
