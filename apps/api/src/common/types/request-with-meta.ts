import type { Request } from "express";

export interface RequestWithMeta extends Request {
  requestStartTime?: number;
}
