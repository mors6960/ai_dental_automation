import type { ApiResponseDto } from "@/common/dto/api-response.dto";
import { HttpException, HttpStatus } from "@nestjs/common";

import { ERROR_MESSAGES } from "@/common/constants/error-messages";

export function createSuccessResponse<T>(params: {
  message: string;
  data: T;
  apiResponseTimeMs: number;
}): ApiResponseDto<T> {
  return {
    success: true,
    error: null,
    message: params.message,
    timestamp: new Date().toISOString(),
    apiResponseTimeMs: params.apiResponseTimeMs,
    data: params.data,
  };
}

export function createErrorResponse(params: {
  message: string;
  code: string;
  details?: unknown;
  apiResponseTimeMs: number;
}): ApiResponseDto<null> {
  return {
    success: false,
    error: {
      code: params.code,
      details: params.details ?? null,
    },
    message: params.message,
    timestamp: new Date().toISOString(),
    apiResponseTimeMs: params.apiResponseTimeMs,
    data: null,
  };
}

export interface ServiceSuccessPayload<T> {
  message: string;
  data: T;
}

export function createServicePayload<T>(message: string, data: T): ServiceSuccessPayload<T> {
  return { message, data };
}

export async function executeControllerAction<T>(action: () => Promise<T> | T): Promise<T> {
  try {
    return await action();
  } catch (error) {
    if (error instanceof HttpException) {
      throw error;
    }

    throw new HttpException(ERROR_MESSAGES.internalServerError, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function executeServiceAction<T>(params: {
  action: () => Promise<T> | T;
  fallbackMessage: string;
  status?: HttpStatus;
}): Promise<T> {
  try {
    return await params.action();
  } catch (error) {
    if (error instanceof HttpException) {
      throw error;
    }

    throw new HttpException(
      params.fallbackMessage,
      params.status ?? HttpStatus.BAD_REQUEST,
    );
  }
}
