import { Body, Controller, Post } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { executeControllerAction } from "@/common/utils/response.util";

import { WHATSAPP_MODULE } from "@/modules/whatsapp/constants/whatsapp.constants";
import { SendWhatsappMessageDto } from "@/modules/whatsapp/dto/send-whatsapp-message.dto";
import { SendWhatsappReminderDto } from "@/modules/whatsapp/dto/send-whatsapp-reminder.dto";
import { WhatsappWebhookDto } from "@/modules/whatsapp/dto/whatsapp-webhook.dto";
import { WhatsappService } from "@/modules/whatsapp/whatsapp.service";

@ApiTags("WhatsApp")
@Controller(WHATSAPP_MODULE.controller)
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Post("send")
  @ApiOperation({ summary: "Queue a WhatsApp message" })
  @ApiOkResponse({ description: "WhatsApp message queued successfully." })
  async send(@Body() payload: SendWhatsappMessageDto) {
    return executeControllerAction(() => this.whatsappService.send(payload));
  }

  @Post("reminder")
  @ApiOperation({ summary: "Queue a WhatsApp appointment reminder" })
  @ApiOkResponse({ description: "WhatsApp reminder queued successfully." })
  async sendReminder(@Body() payload: SendWhatsappReminderDto) {
    return executeControllerAction(() => this.whatsappService.sendReminder(payload));
  }

  @Post("webhook")
  @ApiOperation({ summary: "Process incoming WhatsApp webhook event" })
  @ApiOkResponse({ description: "WhatsApp webhook processed successfully." })
  async processWebhook(@Body() payload: WhatsappWebhookDto) {
    return executeControllerAction(() => this.whatsappService.processWebhook(payload));
  }
}
