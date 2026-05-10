import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { executeControllerAction } from "@/common/utils/response.util";

import { CHATBOT_MODULE } from "@/modules/chatbot/constants/chatbot.constants";
import { ChatbotService } from "@/modules/chatbot/chatbot.service";
import { SendChatMessageDto } from "@/modules/chatbot/dto/send-chat-message.dto";
import { StartChatSessionDto } from "@/modules/chatbot/dto/start-chat-session.dto";

@ApiTags("Chatbot")
@Controller(CHATBOT_MODULE.controller)
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post("session/start")
  @ApiOperation({ summary: "Start a new chatbot session" })
  @ApiOkResponse({ description: "Chatbot session started successfully." })
  async startSession(@Body() payload: StartChatSessionDto): Promise<unknown> {
    return executeControllerAction(() => this.chatbotService.startSession(payload));
  }

  @Post("message")
  @ApiOperation({ summary: "Send a message to chatbot and receive reply" })
  @ApiOkResponse({ description: "Chatbot replied successfully." })
  async sendMessage(@Body() payload: SendChatMessageDto): Promise<unknown> {
    return executeControllerAction(() => this.chatbotService.sendMessage(payload));
  }

  @Get("session/:id")
  @ApiOperation({ summary: "Fetch chatbot session transcript by id" })
  @ApiOkResponse({ description: "Chatbot session fetched successfully." })
  async getSession(@Param("id") id: string): Promise<unknown> {
    return executeControllerAction(() => this.chatbotService.getSession(id));
  }
}
