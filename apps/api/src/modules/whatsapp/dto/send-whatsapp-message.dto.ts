import { IsOptional, IsString } from "class-validator";

export class SendWhatsappMessageDto {
  @IsString()
  to!: string;

  @IsString()
  message!: string;

  @IsOptional()
  @IsString()
  templateKey?: string;
}
