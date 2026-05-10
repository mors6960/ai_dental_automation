import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { map, Observable } from "rxjs";

import { SUCCESS_MESSAGES } from "@/common/constants/success-messages";
import { createSuccessResponse } from "@/common/utils/response.util";
import type { RequestWithMeta } from "@/common/types/request-with-meta";

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ReturnType<typeof createSuccessResponse<T>>> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ReturnType<typeof createSuccessResponse<T>>> {
    const request = context.switchToHttp().getRequest<RequestWithMeta>();

    return next.handle().pipe(
      map((payload) => {
        const message =
          typeof payload === "object" &&
          payload !== null &&
          "message" in payload &&
          typeof (payload as { message?: string }).message === "string"
            ? (payload as { message: string }).message
            : SUCCESS_MESSAGES.healthCheck;

        const data =
          typeof payload === "object" &&
          payload !== null &&
          "data" in payload
            ? (payload as { data: T }).data
            : payload;

        return createSuccessResponse({
          message,
          data,
          apiResponseTimeMs: Date.now() - (request.requestStartTime ?? Date.now()),
        });
      }),
    );
  }
}
