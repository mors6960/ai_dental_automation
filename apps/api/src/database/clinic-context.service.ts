import { Injectable } from "@nestjs/common";

import { getAppConfig } from "@/config/configuration";
import { PrismaService } from "@/database/prisma.service";

@Injectable()
export class ClinicContextService {
  constructor(private readonly prisma: PrismaService) {}

  async getDefaultClinic() {
    const { defaultClinicSlug } = getAppConfig().tenancy;

    return this.prisma.clinic.upsert({
      where: { slug: defaultClinicSlug },
      update: {},
      create: {
        name: "Lumiere Dental",
        slug: defaultClinicSlug,
        timezone: "Asia/Kolkata",
        currency: "INR",
        countryCode: "IN",
      },
    });
  }
}
