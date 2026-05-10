import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { createServicePayload, executeServiceAction } from "@/common/utils/response.util";

import { LEADS_ERROR_MESSAGES } from "@/modules/leads/constants/leads-error-messages";
import { LEADS_SUCCESS_MESSAGES } from "@/modules/leads/constants/leads-success-messages";
import type { CreateLeadDto } from "@/modules/leads/dto/create-lead.dto";
import type { LeadsQueryDto } from "@/modules/leads/dto/leads-query.dto";
import type { UpdateLeadDto } from "@/modules/leads/dto/update-lead.dto";
import { LeadsRepository } from "@/modules/leads/leads.repository";
import { AutomationEventBusService } from "@/modules/automation/automation-event-bus.service";
import { AUTOMATION_EVENT_NAMES } from "@/modules/automation/automation.constants";
import { N8nWebhookService } from "@/modules/automation/n8n-webhook.service";

@Injectable()
export class LeadsService {
  private readonly logger = new Logger(LeadsService.name);

  constructor(
    private readonly leadsRepository: LeadsRepository,
    private readonly automationEventBusService: AutomationEventBusService,
    private readonly n8nWebhookService: N8nWebhookService,
  ) {}

  async create(createLeadDto: CreateLeadDto) {
    return executeServiceAction({
      fallbackMessage: LEADS_ERROR_MESSAGES.createFailed,
      action: async () => {
        const lead = await this.leadsRepository.create(createLeadDto);
        if (!lead || !lead.id || !lead.clinicId) {
          throw new HttpException(LEADS_ERROR_MESSAGES.createFailed, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        try {
          await this.automationEventBusService.publish({
            id: `lead.created:${lead.id}:${lead.createdAt?.toISOString?.() ?? new Date().toISOString()}`,
            eventName: AUTOMATION_EVENT_NAMES.leadCreated,
            clinicId: lead.clinicId,
            entityType: "lead",
            entityId: lead.id,
            occurredAt: new Date().toISOString(),
            initiatedBy: {
              type: "webhook",
            },
            payload: {
              leadId: lead.id,
              source: lead.source,
              status: lead.status,
              duplicateOfLeadId:
                "duplicateOfLeadId" in lead
                  ? (lead as { duplicateOfLeadId?: string }).duplicateOfLeadId
                  : "mergedIntoLeadId" in lead
                    ? (lead as { mergedIntoLeadId?: string }).mergedIntoLeadId
                    : undefined,
            },
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unknown automation queue error";
          this.logger.error(`Lead ${lead.id} created, but automation publish failed: ${message}`);
        }

        try {
          const patient = "patient" in lead ? lead.patient : null;
          await this.n8nWebhookService.triggerLeadFollowup({
            eventName: AUTOMATION_EVENT_NAMES.leadCreated,
            leadId: lead.id,
            clinicId: lead.clinicId,
            patientId: lead.patientId,
            phone: lead.whatsappNumber ?? lead.phone ?? patient?.whatsappNumber ?? patient?.phone,
            email: lead.email,
            fullName: lead.fullName,
            message: lead.message,
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unknown n8n webhook error";
          this.logger.error(`Lead ${lead.id} created, but n8n webhook failed: ${message}`);
        }

        return createServicePayload(LEADS_SUCCESS_MESSAGES.created, lead);
      },
    });
  }

  async findAll(query: LeadsQueryDto) {
    return executeServiceAction({
      fallbackMessage: LEADS_ERROR_MESSAGES.listFailed,
      action: async () => {
        const leads = await this.leadsRepository.findAll(query);
        return createServicePayload(LEADS_SUCCESS_MESSAGES.fetched, leads);
      },
    });
  }

  async findOne(id: string) {
    return executeServiceAction({
      fallbackMessage: LEADS_ERROR_MESSAGES.detailsFailed,
      action: async () => {
        const lead = await this.leadsRepository.findById(id);
        if (!lead) {
          throw new HttpException(LEADS_ERROR_MESSAGES.notFound, HttpStatus.NOT_FOUND);
        }

        return createServicePayload(LEADS_SUCCESS_MESSAGES.details, lead);
      },
    });
  }

  async update(id: string, updateLeadDto: UpdateLeadDto) {
    return executeServiceAction({
      fallbackMessage: LEADS_ERROR_MESSAGES.updateFailed,
      action: async () => {
        const lead = await this.leadsRepository.update(id, updateLeadDto);
        if (!lead) {
          throw new HttpException(LEADS_ERROR_MESSAGES.notFound, HttpStatus.NOT_FOUND);
        }

        return createServicePayload(LEADS_SUCCESS_MESSAGES.updated, lead);
      },
    });
  }
}
