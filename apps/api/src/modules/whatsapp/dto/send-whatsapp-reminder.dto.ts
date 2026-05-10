import { IsOptional, IsString } from "class-validator";

export class SendWhatsappReminderDto {
  @IsString()
  appointmentId!: string;

  @IsString()
  to!: string;

  @IsOptional()
  @IsString()
  reminderType?: string;
}
