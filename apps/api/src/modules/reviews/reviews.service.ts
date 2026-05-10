import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConversationChannel, ReviewRequestStatus } from "@prisma/client";
import { randomUUID } from "crypto";

import { createServicePayload, executeServiceAction } from "@/common/utils/response.util";
import { PrismaService } from "@/database/prisma.service";
import { REVIEWS_ERROR_MESSAGES } from "@/modules/reviews/constants/reviews-error-messages";
import { REVIEWS_SUCCESS_MESSAGES } from "@/modules/reviews/constants/reviews-success-messages";
import { CreateReviewRequestDto } from "@/modules/reviews/dto/create-review-request.dto";
import { WhatsappService } from "@/modules/whatsapp/whatsapp.service";

@Injectable()
export class ReviewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly whatsappService: WhatsappService,
  ) {}

  async createRequest(payload: CreateReviewRequestDto) {
    return executeServiceAction({
      fallbackMessage: REVIEWS_ERROR_MESSAGES.requestFailed,
      action: async () => {
        const appointment = await this.prisma.appointment.findUnique({
          where: { id: payload.appointmentId },
          include: { patient: true },
        });

        if (!appointment || !appointment.patient) {
          throw new HttpException("Appointment not found for review request.", HttpStatus.NOT_FOUND);
        }

        const reviewRequest = await this.createOrReuseReviewRequest({
          clinicId: appointment.clinicId,
          patientId: appointment.patientId,
          appointmentId: appointment.id,
          channel: (payload.channel as ConversationChannel | undefined) ?? ConversationChannel.WHATSAPP,
        });

        return createServicePayload(REVIEWS_SUCCESS_MESSAGES.requested, reviewRequest);
      },
    });
  }

  async findAll() {
    return executeServiceAction({
      fallbackMessage: REVIEWS_ERROR_MESSAGES.listFailed,
      action: async () =>
        createServicePayload(REVIEWS_SUCCESS_MESSAGES.fetched, {
          reviewRequests: await this.prisma.reviewRequest.findMany({
            orderBy: { createdAt: "desc" },
            take: 50,
          }),
          reviews: await this.prisma.review.findMany({
            orderBy: { createdAt: "desc" },
            take: 50,
          }),
        }),
    });
  }

  async createOrReuseReviewRequest(params: {
    clinicId: string;
    patientId: string;
    appointmentId: string;
    channel: ConversationChannel;
  }) {
    const existing = await this.prisma.reviewRequest.findFirst({
      where: {
        appointmentId: params.appointmentId,
        channel: params.channel,
      },
    });

    if (existing) {
      return existing;
    }

    return this.prisma.reviewRequest.create({
      data: {
        clinicId: params.clinicId,
        patientId: params.patientId,
        appointmentId: params.appointmentId,
        channel: params.channel,
        requestToken: randomUUID(),
      },
    });
  }

  async sendReviewRequest(params: {
    reviewRequestId: string;
    appointmentId: string;
    to: string;
  }) {
    const response = await this.whatsappService.sendReminder({
      appointmentId: params.appointmentId,
      to: params.to,
      reminderType: "REVIEW_REQUEST",
    });

    await this.prisma.reviewRequest.update({
      where: { id: params.reviewRequestId },
      data: {
        status: ReviewRequestStatus.SENT,
        sentAt: new Date(),
      },
    });

    return response.data;
  }

  async markRequestFailed(reviewRequestId: string) {
    await this.prisma.reviewRequest.update({
      where: { id: reviewRequestId },
      data: {
        status: ReviewRequestStatus.FAILED,
      },
    });
  }
}
