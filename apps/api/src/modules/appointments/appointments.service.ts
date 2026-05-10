import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { createServicePayload, executeServiceAction } from "@/common/utils/response.util";

import { getAppConfig } from "@/config/configuration";
import { APPOINTMENTS_ERROR_MESSAGES } from "@/modules/appointments/constants/appointments-error-messages";
import {
  APPOINTMENTS_SUCCESS_MESSAGES,
} from "@/modules/appointments/constants/appointments-success-messages";
import { AppointmentStatus } from "@/modules/appointments/constants/appointments.constants";
import { AUTOMATION_EVENT_NAMES } from "@/modules/automation/automation.constants";
import { AutomationEventBusService } from "@/modules/automation/automation-event-bus.service";
import { AutomationOutboxPublisherService } from "@/modules/automation/automation-outbox.publisher.service";
import { N8nWebhookService } from "@/modules/automation/n8n-webhook.service";
import { AppointmentsRepository } from "@/modules/appointments/appointments.repository";
import { AppointmentsQueryDto } from "@/modules/appointments/dto/appointments-query.dto";
import { CancelAppointmentDto } from "@/modules/appointments/dto/cancel-appointment.dto";
import { CreateAppointmentDto } from "@/modules/appointments/dto/create-appointment.dto";
import { UpdateAppointmentDto } from "@/modules/appointments/dto/update-appointment.dto";

@Injectable()
export class AppointmentsService {
  private readonly logger = new Logger(AppointmentsService.name);
  private readonly appConfig = getAppConfig();

  constructor(
    private readonly appointmentsRepository: AppointmentsRepository,
    private readonly automationEventBusService: AutomationEventBusService,
    private readonly automationOutboxPublisherService: AutomationOutboxPublisherService,
    private readonly n8nWebhookService: N8nWebhookService,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto) {
    return executeServiceAction({
      fallbackMessage: APPOINTMENTS_ERROR_MESSAGES.createFailed,
      action: async () => {
        const result = await this.appointmentsRepository.create(createAppointmentDto);
        const appointment = result.appointment;
        if (!appointment) {
          throw new HttpException(
            APPOINTMENTS_ERROR_MESSAGES.createFailed,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }

        try {
          await this.automationOutboxPublisherService.publishEventById(result.outboxEventId);
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unknown automation queue error";
          this.logger.error(
            `Appointment ${appointment.id} created, but outbox publish failed: ${message}`,
          );
        }

        try {
          const patient = this.getAppointmentPatient(appointment);
          await this.n8nWebhookService.triggerBookingConfirmation({
            eventName: AUTOMATION_EVENT_NAMES.appointmentCreated,
            appointmentId: appointment.id,
            clinicId: appointment.clinicId,
            patientId: appointment.patientId,
            patientName: this.getPatientName(patient?.firstName, patient?.lastName),
            phone: patient?.whatsappNumber ?? patient?.phone,
            serviceName: appointment.service?.name ?? appointment.service?.code,
            startAt: appointment.startAt,
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unknown n8n webhook error";
          this.logger.error(
            `Appointment ${appointment.id} created, but booking confirmation webhook failed: ${message}`,
          );
        }

        return createServicePayload(APPOINTMENTS_SUCCESS_MESSAGES.created, appointment);
      },
    });
  }

  async findAll(query: AppointmentsQueryDto) {
    return executeServiceAction({
      fallbackMessage: APPOINTMENTS_ERROR_MESSAGES.listFailed,
      action: async () => {
        const appointments = await this.appointmentsRepository.findAll(query);
        return createServicePayload(APPOINTMENTS_SUCCESS_MESSAGES.fetched, appointments);
      },
    });
  }

  async findOne(id: string) {
    return executeServiceAction({
      fallbackMessage: APPOINTMENTS_ERROR_MESSAGES.detailsFailed,
      action: async () => {
        const appointment = await this.appointmentsRepository.findById(id);
        if (!appointment) {
          throw new HttpException(APPOINTMENTS_ERROR_MESSAGES.notFound, HttpStatus.NOT_FOUND);
        }
        return createServicePayload(APPOINTMENTS_SUCCESS_MESSAGES.details, appointment);
      },
    });
  }

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto) {
    return executeServiceAction({
      fallbackMessage: APPOINTMENTS_ERROR_MESSAGES.updateFailed,
      action: async () => {
        const previousAppointment = await this.appointmentsRepository.findById(id);
        if (!previousAppointment) {
          throw new HttpException(APPOINTMENTS_ERROR_MESSAGES.notFound, HttpStatus.NOT_FOUND);
        }

        const appointment = await this.appointmentsRepository.update(id, updateAppointmentDto);
        if (!appointment) {
          throw new HttpException(APPOINTMENTS_ERROR_MESSAGES.notFound, HttpStatus.NOT_FOUND);
        }

        if (
          previousAppointment.status !== AppointmentStatus.COMPLETED &&
          appointment.status === AppointmentStatus.COMPLETED
        ) {
          try {
          await this.automationEventBusService.publish({
            id: `appointment.completed:${appointment.id}:${appointment.completedAt?.toISOString() ?? new Date().toISOString()}`,
            eventName: AUTOMATION_EVENT_NAMES.appointmentCompleted,
            clinicId: appointment.clinicId,
            entityType: "appointment",
              entityId: appointment.id,
              occurredAt: new Date().toISOString(),
              initiatedBy: {
                type: "system",
              },
              payload: {
                appointmentId: appointment.id,
                patientId: appointment.patientId,
                leadId: appointment.leadId,
                status: appointment.status,
                completedAt: appointment.completedAt,
              },
            });
          } catch (error) {
            const message = error instanceof Error ? error.message : "Unknown automation queue error";
            this.logger.error(
              `Appointment ${appointment.id} completed, but automation publish failed: ${message}`,
            );
          }

          try {
            const patient = this.getAppointmentPatient(appointment);
            await this.n8nWebhookService.triggerReviewRequest({
              eventName: AUTOMATION_EVENT_NAMES.appointmentCompleted,
              appointmentId: appointment.id,
              clinicId: appointment.clinicId,
              patientId: appointment.patientId,
              patientName: this.getPatientName(patient?.firstName, patient?.lastName),
              phone: patient?.whatsappNumber ?? patient?.phone,
              reviewLink: `${this.appConfig.urls.web.replace(/\/+$/, "")}/reviews/${appointment.id}`,
            });
          } catch (error) {
            const message = error instanceof Error ? error.message : "Unknown n8n webhook error";
            this.logger.error(
              `Appointment ${appointment.id} completed, but review request webhook failed: ${message}`,
            );
          }
        }

        return createServicePayload(APPOINTMENTS_SUCCESS_MESSAGES.updated, appointment);
      },
    });
  }

  async cancel(id: string, cancelAppointmentDto: CancelAppointmentDto) {
    return executeServiceAction({
      fallbackMessage: APPOINTMENTS_ERROR_MESSAGES.cancelFailed,
      action: async () => {
        const appointment = await this.appointmentsRepository.update(id, {
          status: AppointmentStatus.CANCELLED,
          cancellationReason: cancelAppointmentDto.reason,
        });
        if (!appointment) {
          throw new HttpException(APPOINTMENTS_ERROR_MESSAGES.notFound, HttpStatus.NOT_FOUND);
        }
        return createServicePayload(APPOINTMENTS_SUCCESS_MESSAGES.cancelled, appointment);
      },
    });
  }

  private getPatientName(firstName?: string | null, lastName?: string | null) {
    return [firstName, lastName].filter(Boolean).join(" ").trim() || "Guest Patient";
  }

  private getAppointmentPatient(appointment: object) {
    if ("patient" in appointment) {
      return appointment.patient as
        | {
            firstName?: string | null;
            lastName?: string | null;
            phone?: string | null;
            whatsappNumber?: string | null;
          }
        | null;
    }

    return null;
  }
}
