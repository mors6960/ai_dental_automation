import { Injectable, NestMiddleware } from "@nestjs/common";

import type { NextFunction, Request, Response } from "express";

import { EncryptionService } from "@/common/services/encryption.service";

@Injectable()
export class DecryptRequestMiddleware implements NestMiddleware {
  constructor(private readonly encryptionService: EncryptionService) {}

  use(req: Request & { body?: unknown }, _res: Response, next: NextFunction) {
    if (this.encryptionService.isEnabled() && req.body) {
      req.body = this.encryptionService.decrypt(req.body);
    }

    next();
  }
}
