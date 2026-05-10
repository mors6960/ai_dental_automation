import { Module } from "@nestjs/common";

import { LeadsController } from "@/modules/leads/leads.controller";
import { LeadsRepository } from "@/modules/leads/leads.repository";
import { LeadsService } from "@/modules/leads/leads.service";

@Module({
  controllers: [LeadsController],
  providers: [LeadsRepository, LeadsService],
  exports: [LeadsService],
})
export class LeadsModule {}
