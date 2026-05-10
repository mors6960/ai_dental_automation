import { Injectable } from "@nestjs/common";

@Injectable()
export class EncryptionService {
  isEnabled() {
    return process.env.ENABLE_ENCRYPTION === "true";
  }

  encrypt<T>(payload: T) {
    return payload;
  }

  decrypt<T>(payload: T) {
    return payload;
  }
}
