import { Module } from "@nestjs/common";

import { ChatbotController } from "@/modules/chatbot/chatbot.controller";
import { ChatbotService } from "@/modules/chatbot/chatbot.service";

@Module({
  controllers: [ChatbotController],
  providers: [ChatbotService],
  exports: [ChatbotService],
})
export class ChatbotModule {}
