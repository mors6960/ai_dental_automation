import { Injectable } from "@nestjs/common";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

@Injectable()
export class PasswordService {
  hash(password: string) {
    const salt = randomBytes(16).toString("hex");
    const derivedKey = scryptSync(password, salt, 64).toString("hex");

    return `scrypt:${salt}:${derivedKey}`;
  }

  verify(password: string, storedHash?: string | null) {
    if (!storedHash) {
      return false;
    }

    const [algorithm, salt, expectedHash] = storedHash.split(":");
    if (algorithm !== "scrypt" || !salt || !expectedHash) {
      return false;
    }

    const derivedKey = scryptSync(password, salt, 64).toString("hex");

    return timingSafeEqual(
      Buffer.from(expectedHash, "hex"),
      Buffer.from(derivedKey, "hex"),
    );
  }
}
