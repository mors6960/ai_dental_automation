import { Injectable, NestMiddleware } from "@nestjs/common";

import type { NextFunction, Response } from "express";

import type { RequestWithMeta } from "@/common/types/request-with-meta";

@Injectable()
export class RequestMetaMiddleware implements NestMiddleware {
  use(req: RequestWithMeta, _res: Response, next: NextFunction) {
    req.requestStartTime = Date.now();
    next();
  }
}
