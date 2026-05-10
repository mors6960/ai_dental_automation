import { Injectable } from "@nestjs/common";

import { createServicePayload, executeServiceAction } from "@/common/utils/response.util";
import { ClinicContextService } from "@/database/clinic-context.service";
import { PrismaService } from "@/database/prisma.service";

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly clinicContext: ClinicContextService,
  ) {}

  async getSummary() {
    return executeServiceAction({
      fallbackMessage: "Unable to fetch admin summary.",
      action: async () => {
        const clinic = await this.clinicContext.getDefaultClinic();
        const [
          leadsCount,
          appointmentsCount,
          pendingReviewsCount,
          activeConversationsCount,
          todayAppointmentsCount,
          bookedLeadsCount,
        ] = await Promise.all([
          this.prisma.lead.count({ where: { clinicId: clinic.id } }),
          this.prisma.appointment.count({ where: { clinicId: clinic.id } }),
          this.prisma.reviewRequest.count({
            where: {
              clinicId: clinic.id,
              status: { in: ["QUEUED", "SENT", "OPENED"] },
            },
          }),
          this.prisma.conversation.count({
            where: {
              clinicId: clinic.id,
              status: { not: "CLOSED" },
            },
          }),
          this.prisma.appointment.count({
            where: {
              clinicId: clinic.id,
              startAt: {
                gte: new Date(new Date().setHours(0, 0, 0, 0)),
              },
            },
          }),
          this.prisma.lead.count({
            where: {
              clinicId: clinic.id,
              status: "BOOKED",
            },
          }),
        ]);

        createServicePayload("Admin summary fetched successfully.", {
          leadsCount,
          appointmentsCount,
          pendingReviewsCount,
          activeConversationsCount,
          todayAppointmentsCount,
          bookedLeadsCount,
        });
      },
    });
  }
}
