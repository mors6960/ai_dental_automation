import { IsOptional, IsString } from "class-validator";

export class CreateReviewRequestDto {
  @IsString()
  appointmentId!: string;

  @IsString()
  patientName!: string;

  @IsOptional()
  @IsString()
  patientPhone?: string;

  @IsOptional()
  @IsString()
  channel?: string;
}
