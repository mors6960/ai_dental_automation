import { Module } from "@nestjs/common";

import { WhatsappController } from "@/modules/whatsapp/whatsapp.controller";
import { WhatsappService } from "@/modules/whatsapp/whatsapp.service";

@Module({
  controllers: [WhatsappController],
  providers: [WhatsappService],
  exports: [WhatsappService],
})
export class WhatsappModule {}
