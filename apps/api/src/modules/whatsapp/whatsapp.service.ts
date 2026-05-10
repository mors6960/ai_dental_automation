import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { randomUUID } from "crypto";

import { createServicePayload, executeServiceAction } from "@/common/utils/response.util";
import { getAppConfig } from "@/config/configuration";
import { WHATSAPP_ERROR_MESSAGES } from "@/modules/whatsapp/constants/whatsapp-error-messages";
import { WHATSAPP_SUCCESS_MESSAGES } from "@/modules/whatsapp/constants/whatsapp-success-messages";
import { WhatsappMessageStatus } from "@/modules/whatsapp/constants/whatsapp.constants";
import { SendWhatsappMessageDto } from "@/modules/whatsapp/dto/send-whatsapp-message.dto";
import { SendWhatsappReminderDto } from "@/modules/whatsapp/dto/send-whatsapp-reminder.dto";
import { WhatsappWebhookDto } from "@/modules/whatsapp/dto/whatsapp-webhook.dto";

type WhatsappRecord = {
  id: string;
  to: string;
  message?: string;
  templateKey?: string;
  reminderType?: string;
  appointmentId?: string;
  status: WhatsappMessageStatus;
  provider: string;
  createdAt: string;
};

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);
  private readonly logs: WhatsappRecord[] = [];

  async send(payload: SendWhatsappMessageDto) {
    return executeServiceAction({
      fallbackMessage: WHATSAPP_ERROR_MESSAGES.sendFailed,
      action: async () => {
        const record = await this.dispatchMessage({
          to: payload.to,
          message: payload.message,
          templateKey: payload.templateKey,
        });

        this.logs.unshift(record);
        return createServicePayload(WHATSAPP_SUCCESS_MESSAGES.sent, record);
      },
    });
  }

  async sendReminder(payload: SendWhatsappReminderDto) {
    return executeServiceAction({
      fallbackMessage: WHATSAPP_ERROR_MESSAGES.reminderFailed,
      action: async () => {
        const reminder = await this.dispatchMessage({
          to: payload.to,
          appointmentId: payload.appointmentId,
          reminderType: payload.reminderType ?? "BOOKING_CONFIRMATION",
          templateKey: payload.reminderType ?? "BOOKING_CONFIRMATION",
          message: this.buildReminderMessage(payload),
        });

        this.logs.unshift(reminder);
        return createServicePayload(WHATSAPP_SUCCESS_MESSAGES.reminder, reminder);
      },
    });
  }

  async processWebhook(payload: WhatsappWebhookDto) {
    return executeServiceAction({
      fallbackMessage: WHATSAPP_ERROR_MESSAGES.webhookFailed,
      action: () => {
        const event = {
          id: randomUUID(),
          ...payload,
          receivedAt: new Date().toISOString(),
        };
        return createServicePayload(WHATSAPP_SUCCESS_MESSAGES.webhook, event);
      },
    });
  }

  private async dispatchMessage(params: {
    to: string;
    message?: string;
    templateKey?: string;
    reminderType?: string;
    appointmentId?: string;
  }): Promise<WhatsappRecord> {
    const config = getAppConfig().whatsapp;

    if (config.provider === "twilio") {
      return this.sendViaTwilio(params);
    }

    const record: WhatsappRecord = {
      id: randomUUID(),
      to: params.to,
      message: params.message,
      templateKey: params.templateKey,
      reminderType: params.reminderType,
      appointmentId: params.appointmentId,
      status: WhatsappMessageStatus.SENT,
      provider: "mock",
      createdAt: new Date().toISOString(),
    };

    this.logger.log(`Mock WhatsApp send to ${params.to} with template ${params.templateKey ?? "custom"}`);
    return record;
  }

  private async sendViaTwilio(params: {
    to: string;
    message?: string;
    templateKey?: string;
    reminderType?: string;
    appointmentId?: string;
  }): Promise<WhatsappRecord> {
    const config = getAppConfig().whatsapp;

    if (!config.twilioAccountSid || !config.twilioAuthToken || !config.fromNumber) {
      throw new HttpException(
        "Twilio WhatsApp provider is configured but credentials are incomplete.",
        HttpStatus.BAD_REQUEST,
      );
    }

    const body = new URLSearchParams({
      To: params.to.startsWith("whatsapp:") ? params.to : `whatsapp:${params.to}`,
      From: config.fromNumber.startsWith("whatsapp:")
        ? config.fromNumber
        : `whatsapp:${config.fromNumber}`,
      Body: params.message ?? "",
    });

    const response = await fetch(
      `${config.twilioApiBaseUrl}/Accounts/${config.twilioAccountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${config.twilioAccountSid}:${config.twilioAuthToken}`,
          ).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      },
    );

    if (!response.ok) {
      const text = await response.text();
      this.logger.error(`Twilio send failed: ${text}`);
      throw new HttpException(WHATSAPP_ERROR_MESSAGES.sendFailed, HttpStatus.BAD_GATEWAY);
    }

    const result = (await response.json()) as { sid: string; status?: string };

    return {
      id: result.sid,
      to: params.to,
      message: params.message,
      templateKey: params.templateKey,
      reminderType: params.reminderType,
      appointmentId: params.appointmentId,
      status:
        result.status === "delivered" ? WhatsappMessageStatus.DELIVERED : WhatsappMessageStatus.SENT,
      provider: "twilio",
      createdAt: new Date().toISOString(),
    };
  }

  private buildReminderMessage(payload: SendWhatsappReminderDto) {
    switch (payload.reminderType) {
      case "REVIEW_REQUEST":
        return `Thanks for visiting Lumiere Dental. We'd love your feedback for appointment ${payload.appointmentId}.`;
      case "LEAD_FOLLOW_UP":
        return `Hi! This is Aria from Lumiere Dental. I'm following up on your recent inquiry and can help book your visit.`;
      case "BOOKING_CONFIRMATION":
      default:
        return `Your appointment ${payload.appointmentId} with Lumiere Dental is confirmed. Reply here if you need any help.`;
    }
  }
}
