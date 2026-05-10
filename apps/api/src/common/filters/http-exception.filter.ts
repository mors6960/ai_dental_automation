import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";

import type { Response } from "express";

import { ERROR_MESSAGES } from "@/common/constants/error-messages";
import { createErrorResponse } from "@/common/utils/response.util";
import type { RequestWithMeta } from "@/common/types/request-with-meta";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<RequestWithMeta>();

    const isHttpException = exception instanceof HttpException;
    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = isHttpException ? exception.getResponse() : null;
    const message =
      typeof exceptionResponse === "object" &&
      exceptionResponse !== null &&
      "message" in exceptionResponse
        ? Array.isArray(exceptionResponse.message)
          ? exceptionResponse.message.join(", ")
          : String(exceptionResponse.message)
        : isHttpException
          ? exception.message
          : ERROR_MESSAGES.internalServerError;

    const code = isHttpException
      ? HttpStatus[status] ?? "HTTP_EXCEPTION"
      : "INTERNAL_SERVER_ERROR";

    response.status(status).json(
      createErrorResponse({
        message,
        code,
        details:
          typeof exceptionResponse === "object" && exceptionResponse !== null
            ? exceptionResponse
            : null,
        apiResponseTimeMs: Date.now() - (request.requestStartTime ?? Date.now()),
      }),
    );
  }
}
