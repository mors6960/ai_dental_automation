import { Injectable } from "@nestjs/common";
import { LeadStatus, Prisma } from "@prisma/client";

import { ClinicContextService } from "@/database/clinic-context.service";
import { PrismaService } from "@/database/prisma.service";
import type { CreateLeadDto } from "@/modules/leads/dto/create-lead.dto";
import type { LeadsQueryDto } from "@/modules/leads/dto/leads-query.dto";
import type { UpdateLeadDto } from "@/modules/leads/dto/update-lead.dto";

const ALLOWED_STATUS_TRANSITIONS: Record<LeadStatus, LeadStatus[]> = {
  NEW: [LeadStatus.QUALIFIED, LeadStatus.CONTACTED, LeadStatus.LOST],
  QUALIFIED: [LeadStatus.CONTACTED, LeadStatus.BOOKED, LeadStatus.LOST],
  CONTACTED: [LeadStatus.QUALIFIED, LeadStatus.BOOKED, LeadStatus.LOST],
  BOOKED: [LeadStatus.WON, LeadStatus.LOST],
  WON: [],
  LOST: [],
  ARCHIVED: [],
};

@Injectable()
export class LeadsRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly clinicContext: ClinicContextService,
  ) {}

  private async resolveService(clinicId: string, serviceInterest?: string) {
    if (!serviceInterest) {
      return null;
    }

    return this.prisma.serviceCatalog.findFirst({
      where: {
        clinicId,
        OR: [{ code: serviceInterest }, { name: serviceInterest }],
      },
    });
  }

  private async upsertPatient(
    clinicId: string,
    payload: { fullName: string; email?: string; phone?: string; whatsappNumber?: string; preferredLanguage?: string },
  ) {
    if (!payload.phone && !payload.whatsappNumber && !payload.email) {
      return null;
    }

    const [firstName, ...restName] = payload.fullName.trim().split(/\s+/);
    const lastName = restName.join(" ") || "-";
    const phone = payload.phone ?? payload.whatsappNumber;

    const existingPatient = await this.prisma.patient.findFirst({
      where: {
        clinicId,
        OR: [
          payload.email ? { email: payload.email } : undefined,
          phone ? { phone } : undefined,
          payload.whatsappNumber ? { whatsappNumber: payload.whatsappNumber } : undefined,
        ].filter(Boolean) as Prisma.PatientWhereInput[],
      },
    });

    if (existingPatient) {
      return this.prisma.patient.update({
        where: { id: existingPatient.id },
        data: {
          firstName,
          lastName,
          email: payload.email ?? existingPatient.email,
          phone: phone ?? existingPatient.phone,
          whatsappNumber: payload.whatsappNumber ?? existingPatient.whatsappNumber,
          preferredLanguage: payload.preferredLanguage ?? existingPatient.preferredLanguage,
        },
      });
    }

    return this.prisma.patient.create({
      data: {
        clinicId,
        firstName,
        lastName,
        email: payload.email,
        phone: phone ?? "UNKNOWN",
        whatsappNumber: payload.whatsappNumber,
        preferredLanguage: payload.preferredLanguage ?? "en",
      },
    });
  }

  private assertStatusTransition(currentStatus: LeadStatus, nextStatus: LeadStatus) {
    if (currentStatus === nextStatus) {
      return;
    }

    if (!ALLOWED_STATUS_TRANSITIONS[currentStatus].includes(nextStatus)) {
      throw new Error(`Invalid lead status transition from ${currentStatus} to ${nextStatus}.`);
    }
  }

  async create(payload: CreateLeadDto) {
    const clinic = await this.clinicContext.getDefaultClinic();
    const patient = await this.upsertPatient(clinic.id, payload);
    const service = await this.resolveService(clinic.id, payload.serviceInterest);

    const duplicateLead = await this.prisma.lead.findFirst({
      where: {
        clinicId: clinic.id,
        OR: [
          payload.email ? { email: payload.email } : undefined,
          payload.phone ? { phone: payload.phone } : undefined,
          payload.whatsappNumber ? { whatsappNumber: payload.whatsappNumber } : undefined,
        ].filter(Boolean) as Prisma.LeadWhereInput[],
      },
      include: {
        activities: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (duplicateLead) {
      await this.prisma.lead.update({
        where: { id: duplicateLead.id },
        data: {
          patientId: patient?.id ?? duplicateLead.patientId,
          assignedUserId: payload.assignedUserId ?? duplicateLead.assignedUserId,
          source: payload.source,
          inquiryType: payload.inquiryType ?? duplicateLead.inquiryType,
          serviceInterestId: service?.id ?? duplicateLead.serviceInterestId,
          priorityScore: payload.priorityScore ?? duplicateLead.priorityScore,
          qualificationScore: payload.qualificationScore ?? duplicateLead.qualificationScore,
          preferredLanguage: payload.preferredLanguage ?? duplicateLead.preferredLanguage,
          utmSource: payload.utmSource ?? duplicateLead.utmSource,
          utmMedium: payload.utmMedium ?? duplicateLead.utmMedium,
          utmCampaign: payload.utmCampaign ?? duplicateLead.utmCampaign,
          utmTerm: payload.utmTerm ?? duplicateLead.utmTerm,
          utmContent: payload.utmContent ?? duplicateLead.utmContent,
          message: payload.message ?? duplicateLead.message,
          lastContactAt: new Date(),
        },
      });

      await this.prisma.leadActivity.create({
        data: {
          leadId: duplicateLead.id,
          type: "DUPLICATE_DETECTED",
          title: "Duplicate lead merged into existing record",
          description: "Incoming lead matched on phone, WhatsApp number, or email.",
          metadata: {
            ...payload,
          },
        },
      });

      const mergedLead = await this.findById(duplicateLead.id);

      if (!mergedLead) {
        throw new Error(`Merged lead ${duplicateLead.id} could not be reloaded.`);
      }

      return {
        ...mergedLead,
        duplicateOfLeadId: undefined,
        mergedIntoLeadId: duplicateLead.id,
        wasDuplicate: true,
      };
    }

    const lead = await this.prisma.lead.create({
      data: {
        clinicId: clinic.id,
        patientId: patient?.id,
        assignedUserId: payload.assignedUserId,
        source: payload.source,
        status: payload.status ?? LeadStatus.NEW,
        fullName: payload.fullName,
        email: payload.email,
        phone: payload.phone,
        whatsappNumber: payload.whatsappNumber,
        inquiryType: payload.inquiryType,
        serviceInterestId: service?.id,
        priorityScore: payload.priorityScore ?? 0,
        qualificationScore: payload.qualificationScore ?? 0,
        preferredLanguage: payload.preferredLanguage ?? "en",
        utmSource: payload.utmSource,
        utmMedium: payload.utmMedium,
        utmCampaign: payload.utmCampaign,
        utmTerm: payload.utmTerm,
        utmContent: payload.utmContent,
        message: payload.message,
      },
      include: {
        activities: true,
        patient: true,
        serviceInterest: true,
      },
    });

    await this.prisma.leadActivity.create({
      data: {
        leadId: lead.id,
        type: "LEAD_CREATED",
        title: "Lead created",
        description: "Lead captured from API flow.",
        metadata: {
          source: payload.source,
          utmSource: payload.utmSource,
          utmCampaign: payload.utmCampaign,
        },
      },
    });

    return this.findById(lead.id);
  }

  async findAll(query: LeadsQueryDto) {
    const clinic = await this.clinicContext.getDefaultClinic();

    return this.prisma.lead.findMany({
      where: {
        clinicId: clinic.id,
        status: query.status,
        source: query.source,
        OR: query.search
          ? [
              { fullName: { contains: query.search } },
              { email: { contains: query.search } },
              { phone: { contains: query.search } },
              { whatsappNumber: { contains: query.search } },
              { message: { contains: query.search } },
            ]
          : undefined,
      },
      include: {
        patient: true,
        serviceInterest: true,
        activities: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        appointments: {
          orderBy: { startAt: "desc" },
          take: 5,
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string) {
    return this.prisma.lead.findUnique({
      where: { id },
      include: {
        patient: true,
        serviceInterest: true,
        activities: {
          orderBy: { createdAt: "desc" },
        },
        appointments: {
          orderBy: { startAt: "desc" },
        },
      },
    });
  }

  async update(id: string, payload: UpdateLeadDto) {
    const existingLead = await this.findById(id);
    if (!existingLead) {
      return null;
    }

    if (payload.status) {
      this.assertStatusTransition(existingLead.status, payload.status as LeadStatus);
    }

    const service = await this.resolveService(
      existingLead.clinicId,
      payload.serviceInterest,
    );
    const patient =
      payload.fullName || payload.email || payload.phone || payload.whatsappNumber
        ? await this.upsertPatient(existingLead.clinicId, {
            fullName: payload.fullName ?? existingLead.fullName,
            email: payload.email ?? existingLead.email ?? undefined,
            phone: payload.phone ?? existingLead.phone ?? undefined,
            whatsappNumber:
              payload.whatsappNumber ?? existingLead.whatsappNumber ?? undefined,
            preferredLanguage:
              payload.preferredLanguage ?? existingLead.preferredLanguage ?? undefined,
          })
        : null;

    const updatedLead = await this.prisma.lead.update({
      where: { id },
      data: {
        patientId: patient?.id ?? existingLead.patientId,
        assignedUserId: payload.assignedUserId ?? existingLead.assignedUserId,
        fullName: payload.fullName ?? existingLead.fullName,
        email: payload.email ?? existingLead.email,
        phone: payload.phone ?? existingLead.phone,
        whatsappNumber: payload.whatsappNumber ?? existingLead.whatsappNumber,
        source: payload.source ?? existingLead.source,
        status: payload.status ?? existingLead.status,
        inquiryType: payload.inquiryType ?? existingLead.inquiryType,
        serviceInterestId: service?.id ?? existingLead.serviceInterestId,
        message: payload.message ?? existingLead.message,
        preferredLanguage:
          payload.preferredLanguage ?? existingLead.preferredLanguage,
        priorityScore: payload.priorityScore ?? existingLead.priorityScore,
        qualificationScore:
          payload.qualificationScore ?? existingLead.qualificationScore,
        utmSource: payload.utmSource ?? existingLead.utmSource,
        utmMedium: payload.utmMedium ?? existingLead.utmMedium,
        utmCampaign: payload.utmCampaign ?? existingLead.utmCampaign,
        utmTerm: payload.utmTerm ?? existingLead.utmTerm,
        utmContent: payload.utmContent ?? existingLead.utmContent,
        lastContactAt: new Date(),
        convertedAt:
          payload.status === LeadStatus.WON && existingLead.convertedAt === null
            ? new Date()
            : existingLead.convertedAt,
      },
    });

    await this.prisma.leadActivity.create({
      data: {
        leadId: id,
        type: payload.status && payload.status !== existingLead.status ? "STATUS_CHANGED" : "LEAD_UPDATED",
        title:
          payload.status && payload.status !== existingLead.status
            ? `Lead moved to ${payload.status}`
            : "Lead details updated",
        description:
          payload.status && payload.status !== existingLead.status
            ? `Status changed from ${existingLead.status} to ${payload.status}.`
            : "Lead profile fields were updated.",
        metadata: {
          ...payload,
        },
      },
    });

    return {
      ...updatedLead,
      timeline: await this.prisma.leadActivity.findMany({
        where: { leadId: id },
        orderBy: { createdAt: "desc" },
      }),
    };
  }
}
