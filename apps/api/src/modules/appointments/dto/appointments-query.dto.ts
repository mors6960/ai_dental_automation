import { IsEnum, IsOptional, IsString } from "class-validator";

import { AppointmentStatus } from "@/modules/appointments/constants/appointments.constants";

export class AppointmentsQueryDto {
  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @IsOptional()
  @IsString()
  date?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
