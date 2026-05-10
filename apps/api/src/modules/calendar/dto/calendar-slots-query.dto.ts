import { IsOptional, IsString } from "class-validator";

export class CalendarSlotsQueryDto {
  @IsOptional()
  @IsString()
  date?: string;

  @IsOptional()
  @IsString()
  service?: string;
}
