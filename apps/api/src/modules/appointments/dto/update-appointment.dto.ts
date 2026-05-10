import { IsDateString, IsEnum, IsOptional, IsString } from "class-validator";

import { AppointmentStatus } from "@/modules/appointments/constants/appointments.constants";

export class UpdateAppointmentDto {
  @IsOptional()
  @IsString()
  patientName?: string;

  @IsOptional()
  @IsString()
  patientPhone?: string;

  @IsOptional()
  @IsString()
  patientEmail?: string;

  @IsOptional()
  @IsString()
  serviceName?: string;

  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @IsOptional()
  @IsDateString()
  startAt?: string;

  @IsOptional()
  @IsDateString()
  endAt?: string;

  @IsOptional()
  @IsString()
  reasonForVisit?: string;

  @IsOptional()
  @IsString()
  cancellationReason?: string;

  @IsOptional()
  @IsString()
  confirmationChannel?: string;
}
