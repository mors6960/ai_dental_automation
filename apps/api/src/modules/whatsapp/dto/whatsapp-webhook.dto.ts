import { IsOptional, IsString } from "class-validator";

export class WhatsappWebhookDto {
  @IsOptional()
  @IsString()
  messageId?: string;

  @IsOptional()
  @IsString()
  from?: string;

  @IsOptional()
  @IsString()
  body?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
