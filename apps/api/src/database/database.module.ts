import { Global, Module } from "@nestjs/common";

import { ClinicContextService } from "@/database/clinic-context.service";
import { PrismaService } from "@/database/prisma.service";

@Global()
@Module({
  providers: [PrismaService, ClinicContextService],
  exports: [PrismaService, ClinicContextService],
})
export class DatabaseModule {}
