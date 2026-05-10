import { IsDateString, IsEnum, IsOptional, IsString } from "class-validator";

import {
  AppointmentSource,
  AppointmentStatus,
} from "@/modules/appointments/constants/appointments.constants";

export class CreateAppointmentDto {
  @IsString()
  patientName!: string;

  @IsOptional()
  @IsString()
  patientPhone?: string;

  @IsOptional()
  @IsString()
  patientEmail?: string;

  @IsOptional()
  @IsString()
  leadId?: string;

  @IsOptional()
  @IsString()
  serviceName?: string;

  @IsOptional()
  @IsString()
  bookedByUserId?: string;

  @IsEnum(AppointmentSource)
  source!: AppointmentSource;

  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @IsDateString()
  startAt!: string;

  @IsDateString()
  endAt!: string;

  @IsOptional()
  @IsString()
  reasonForVisit?: string;

  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsString()
  confirmationChannel?: string;
}
