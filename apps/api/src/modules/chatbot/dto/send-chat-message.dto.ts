import { IsOptional, IsString } from "class-validator";

export class SendChatMessageDto {
  @IsString()
  sessionId!: string;

  @IsString()
  message!: string;

  @IsOptional()
  @IsString()
  language?: string;
}
