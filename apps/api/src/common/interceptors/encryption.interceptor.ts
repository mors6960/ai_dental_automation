import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { map, Observable } from "rxjs";

import { EncryptionService } from "@/common/services/encryption.service";

@Injectable()
export class EncryptionInterceptor implements NestInterceptor {
  constructor(private readonly encryptionService: EncryptionService) {}

  intercept(_context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((payload) => {
        if (!this.encryptionService.isEnabled()) {
          return payload;
        }

        return this.encryptionService.encrypt(payload);
      }),
    );
  }
}
