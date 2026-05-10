import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { createServicePayload, executeServiceAction } from "@/common/utils/response.util";

import { CHATBOT_ERROR_MESSAGES } from "@/modules/chatbot/constants/chatbot-error-messages";
import { CHATBOT_SUCCESS_MESSAGES } from "@/modules/chatbot/constants/chatbot-success-messages";
import { ChatbotSessionStatus } from "@/modules/chatbot/constants/chatbot.constants";
import { SendChatMessageDto } from "@/modules/chatbot/dto/send-chat-message.dto";
import { StartChatSessionDto } from "@/modules/chatbot/dto/start-chat-session.dto";

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
  createdAt: string;
}

interface ChatSession {
  id: string;
  status: ChatbotSessionStatus;
  patientName?: string;
  phone?: string;
  leadId?: string;
  channel: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class ChatbotService {
  private readonly sessions: ChatSession[] = [];

  async startSession(payload: StartChatSessionDto) {
    return executeServiceAction({
      fallbackMessage: CHATBOT_ERROR_MESSAGES.startFailed,
      action: () => {
      const now = new Date().toISOString();
      const session: ChatSession = {
        id: randomUUID(),
        status: ChatbotSessionStatus.OPEN,
        patientName: payload.patientName,
        phone: payload.phone,
        leadId: payload.leadId,
        channel: payload.channel ?? "WEB_CHAT",
        messages: [],
        createdAt: now,
        updatedAt: now,
      };
      this.sessions.unshift(session);
      return createServicePayload(CHATBOT_SUCCESS_MESSAGES.started, session);
      },
    });
  }

  async sendMessage(payload: SendChatMessageDto) {
    return executeServiceAction({
      fallbackMessage: CHATBOT_ERROR_MESSAGES.messageFailed,
      action: () => {
      const session = this.sessions.find((item) => item.id === payload.sessionId);
      if (!session) {
        throw new HttpException(CHATBOT_ERROR_MESSAGES.notFound, HttpStatus.NOT_FOUND);
      }

      const userMessage: ChatMessage = {
        role: "user",
        text: payload.message,
        createdAt: new Date().toISOString(),
      };

      const aiMessage: ChatMessage = {
        role: "assistant",
        text: `Aria here. I understood: "${payload.message}". I can help qualify the visit and book an appointment next.`,
        createdAt: new Date().toISOString(),
      };

      session.messages.push(userMessage, aiMessage);
      session.updatedAt = new Date().toISOString();

      return createServicePayload(CHATBOT_SUCCESS_MESSAGES.replied, {
          sessionId: session.id,
          reply: aiMessage.text,
          messages: session.messages,
        });
      },
    });
  }

  async getSession(sessionId: string) {
    return executeServiceAction({
      fallbackMessage: CHATBOT_ERROR_MESSAGES.detailsFailed,
      action: () => {
      const session = this.sessions.find((item) => item.id === sessionId);
      if (!session) {
        throw new HttpException(CHATBOT_ERROR_MESSAGES.notFound, HttpStatus.NOT_FOUND);
      }
      return createServicePayload(CHATBOT_SUCCESS_MESSAGES.details, session);
      },
    });
  }
}
