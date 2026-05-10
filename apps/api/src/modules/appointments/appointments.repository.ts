import { Injectable } from "@nestjs/common";
import {
  AutomationOutboxStatus,
  AppointmentStatus,
  ConversationChannel,
  Prisma,
} from "@prisma/client";

import { AUTOMATION_EVENT_NAMES } from "@/modules/automation/automation.constants";
import { ClinicContextService } from "@/database/clinic-context.service";
import { PrismaService } from "@/database/prisma.service";
import { CreateAppointmentDto } from "@/modules/appointments/dto/create-appointment.dto";
import { AppointmentsQueryDto } from "@/modules/appointments/dto/appointments-query.dto";
import { UpdateAppointmentDto } from "@/modules/appointments/dto/update-appointment.dto";

const ALLOWED_STATUS_TRANSITIONS: Record<AppointmentStatus, AppointmentStatus[]> = {
  PENDING: [AppointmentStatus.CONFIRMED, AppointmentStatus.CANCELLED, AppointmentStatus.RESCHEDULED],
  CONFIRMED: [AppointmentStatus.RESCHEDULED, AppointmentStatus.CANCELLED, AppointmentStatus.COMPLETED, AppointmentStatus.NO_SHOW],
  RESCHEDULED: [AppointmentStatus.CONFIRMED, AppointmentStatus.CANCELLED],
  CANCELLED: [],
  COMPLETED: [],
  NO_SHOW: [],
};

@Injectable()
export class AppointmentsRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly clinicContext: ClinicContextService,
  ) {}

  private readonly transactionOptions = {
    timeout: 10000,
  } as const;

  private assertStatusTransition(currentStatus: AppointmentStatus, nextStatus: AppointmentStatus) {
    if (currentStatus === nextStatus) {
      return;
    }

    if (!ALLOWED_STATUS_TRANSITIONS[currentStatus].includes(nextStatus)) {
      throw new Error(
        `Invalid appointment status transition from ${currentStatus} to ${nextStatus}.`,
      );
    }
  }

  private async resolvePatient(
    db: PrismaService | Prisma.TransactionClient,
    clinicId: string,
    payload: CreateAppointmentDto | UpdateAppointmentDto,
  ) {
    const patientName = payload.patientName;
    const [firstName, ...restName] = (patientName ?? "Guest Patient").trim().split(/\s+/);
    const lastName = restName.join(" ") || "-";
    const phone = payload.patientPhone;

    const existingPatient = await db.patient.findFirst({
      where: {
        clinicId,
        OR: [
          payload.patientEmail ? { email: payload.patientEmail } : undefined,
          phone ? { phone } : undefined,
        ].filter(Boolean) as Prisma.PatientWhereInput[],
      },
    });

    if (existingPatient) {
      return db.patient.update({
        where: { id: existingPatient.id },
        data: {
          firstName: patientName ? firstName : existingPatient.firstName,
          lastName: patientName ? lastName : existingPatient.lastName,
          email: payload.patientEmail ?? existingPatient.email,
          phone: phone ?? existingPatient.phone,
        },
      });
    }

    return db.patient.create({
      data: {
        clinicId,
        firstName,
        lastName,
        email: payload.patientEmail,
        phone: phone ?? `walkin-${Date.now()}`,
      },
    });
  }

  private async resolveService(
    db: PrismaService | Prisma.TransactionClient,
    clinicId: string,
    serviceName?: string,
  ) {
    if (!serviceName) {
      return null;
    }

    return db.serviceCatalog.findFirst({
      where: {
        clinicId,
        OR: [{ name: serviceName }, { code: serviceName }],
      },
    });
  }

  private async ensureNoOverlap(
    db: PrismaService | Prisma.TransactionClient,
    clinicId: string,
    startAt: Date,
    endAt: Date,
    ignoreId?: string,
  ) {
    const overlappingAppointment = await db.appointment.findFirst({
      where: {
        clinicId,
        id: ignoreId ? { not: ignoreId } : undefined,
        status: {
          in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED, AppointmentStatus.RESCHEDULED],
        },
        startAt: { lt: endAt },
        endAt: { gt: startAt },
      },
    });

    if (overlappingAppointment) {
      throw new Error("Appointment slot overlaps with an existing booking.");
    }
  }

  private async createStatusHistory(
    appointmentId: string,
    status: AppointmentStatus,
    note: string,
    changedByUserId?: string,
  ) {
    await this.prisma.appointmentStatusHistory.create({
      data: {
        appointmentId,
        changedByUserId,
        status,
        note,
      },
    });
  }

  async create(payload: CreateAppointmentDto) {
    const clinic = await this.clinicContext.getDefaultClinic();
    const startAt = new Date(payload.startAt);
    const endAt = new Date(payload.endAt);

    if (!(startAt < endAt)) {
      throw new Error("Appointment end time must be after start time.");
    }

    const transactionResult = await this.prisma.$transaction(async (tx) => {
      await this.ensureNoOverlap(tx, clinic.id, startAt, endAt);

      const service = await this.resolveService(tx, clinic.id, payload.serviceName);
      const patient = await this.resolvePatient(tx, clinic.id, payload);
      const lead = payload.leadId
        ? await tx.lead.findUnique({ where: { id: payload.leadId } })
        : null;

      const appointment = await tx.appointment.create({
        data: {
          clinicId: clinic.id,
          patientId: patient.id,
          leadId: lead?.id,
          serviceId: service?.id,
          bookedByUserId: payload.bookedByUserId,
          source: payload.source,
          status: payload.status ?? AppointmentStatus.PENDING,
          reasonForVisit: payload.reasonForVisit,
          timezone: payload.timezone ?? "Asia/Kolkata",
          startAt,
          endAt,
          confirmationChannel:
            (payload.confirmationChannel as ConversationChannel | undefined) ??
            ConversationChannel.WHATSAPP,
        },
      });

      await tx.appointmentStatusHistory.create({
        data: {
          appointmentId: appointment.id,
          changedByUserId: payload.bookedByUserId,
          status: appointment.status,
          note: "Appointment created.",
        },
      });

      if (lead && [lead.status].some((status) => ["NEW", "QUALIFIED", "CONTACTED"].includes(status))) {
        await tx.lead.update({
          where: { id: lead.id },
          data: {
            status: "BOOKED",
            lastContactAt: new Date(),
          },
        });
        await tx.leadActivity.create({
          data: {
            leadId: lead.id,
            actorUserId: payload.bookedByUserId,
            type: "APPOINTMENT_BOOKED",
            title: "Appointment booked from lead",
            description: `Appointment ${appointment.id} was booked.`,
            metadata: {
              appointmentId: appointment.id,
              startAt,
              endAt,
            },
          },
        });
      }

      const outboxEvent = await tx.automationOutboxEvent.create({
        data: {
          clinicId: clinic.id,
          eventName: AUTOMATION_EVENT_NAMES.appointmentCreated,
          entityType: "appointment",
          entityId: appointment.id,
          aggregateType: "appointment",
          aggregateId: appointment.id,
          status: AutomationOutboxStatus.PENDING,
          payload: {
            appointmentId: appointment.id,
            clinicId: clinic.id,
          },
        },
      });

      return {
        appointmentId: appointment.id,
        outboxEventId: outboxEvent.id,
      };
    }, this.transactionOptions);

    const appointment = await this.findById(transactionResult.appointmentId);

    return {
      appointment,
      outboxEventId: transactionResult.outboxEventId,
    };
  }

  async findAll(query: AppointmentsQueryDto) {
    const clinic = await this.clinicContext.getDefaultClinic();

    return this.prisma.appointment.findMany({
      where: {
        clinicId: clinic.id,
        status: query.status,
        startAt:
          query.date
            ? {
                gte: new Date(`${query.date}T00:00:00.000Z`),
                lt: new Date(`${query.date}T23:59:59.999Z`),
              }
            : undefined,
        OR: query.search
          ? [
              { patient: { firstName: { contains: query.search } } },
              { patient: { lastName: { contains: query.search } } },
              { patient: { email: { contains: query.search } } },
            ]
          : undefined,
      },
      include: {
        patient: true,
        lead: true,
        service: true,
        reminders: true,
        statusHistory: {
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { startAt: "asc" },
    });
  }

  async findById(id: string) {
    return this.prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: true,
        lead: true,
        service: true,
        reminders: true,
        messages: {
          orderBy: { createdAt: "desc" },
        },
        statusHistory: {
          orderBy: { createdAt: "desc" },
        },
      },
    });
  }

  async update(id: string, payload: UpdateAppointmentDto) {
    const existingAppointment = await this.findById(id);
    if (!existingAppointment) {
      return null;
    }

    const startAt = payload.startAt ? new Date(payload.startAt) : existingAppointment.startAt;
    const endAt = payload.endAt ? new Date(payload.endAt) : existingAppointment.endAt;

    if (!(startAt < endAt)) {
      throw new Error("Appointment end time must be after start time.");
    }

    await this.ensureNoOverlap(
      this.prisma,
      existingAppointment.clinicId,
      startAt,
      endAt,
      existingAppointment.id,
    );

    const service = await this.resolveService(this.prisma, existingAppointment.clinicId, payload.serviceName);
    const patient =
      payload.patientName || payload.patientEmail || payload.patientPhone
        ? await this.resolvePatient(this.prisma, existingAppointment.clinicId, payload)
        : null;

    if (payload.status) {
      this.assertStatusTransition(existingAppointment.status, payload.status as AppointmentStatus);
    }

    const nextStatus = (payload.status as AppointmentStatus | undefined) ?? existingAppointment.status;
    await this.prisma.appointment.update({
      where: { id },
      data: {
        patientId: patient?.id ?? existingAppointment.patientId,
        serviceId: service?.id ?? existingAppointment.serviceId,
        status: nextStatus,
        startAt,
        endAt,
        reasonForVisit: payload.reasonForVisit ?? existingAppointment.reasonForVisit,
        confirmationChannel:
          (payload.confirmationChannel as ConversationChannel | undefined) ??
          existingAppointment.confirmationChannel,
        cancellationReason:
          payload.cancellationReason ?? existingAppointment.cancellationReason,
        cancelledAt:
          nextStatus === AppointmentStatus.CANCELLED
            ? existingAppointment.cancelledAt ?? new Date()
            : existingAppointment.cancelledAt,
        confirmedAt:
          nextStatus === AppointmentStatus.CONFIRMED
            ? existingAppointment.confirmedAt ?? new Date()
            : existingAppointment.confirmedAt,
        completedAt:
          nextStatus === AppointmentStatus.COMPLETED
            ? existingAppointment.completedAt ?? new Date()
            : existingAppointment.completedAt,
      },
    });

    await this.createStatusHistory(
      id,
      nextStatus,
      payload.status && payload.status !== existingAppointment.status
        ? `Status changed from ${existingAppointment.status} to ${payload.status}.`
        : "Appointment details updated.",
    );

    return this.findById(id);
  }
}
