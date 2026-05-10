import { Injectable } from "@nestjs/common";
import { createHmac, timingSafeEqual } from "node:crypto";

import { getAppConfig } from "@/config/configuration";

interface TokenPayload {
  sub: string;
  email: string;
  role: string;
  clinicId: string;
  type: "access" | "refresh";
  sessionId?: string;
  exp?: number;
  iat?: number;
}

function encodeBase64Url(value: Buffer | string) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function decodeBase64Url(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const normalized = `${base64}${"=".repeat((4 - (base64.length % 4)) % 4)}`;
  return Buffer.from(normalized, "base64").toString("utf8");
}

function parseDurationToSeconds(value: string) {
  const match = /^(\d+)([smhd])$/i.exec(value.trim());
  if (!match) {
    return 15 * 60;
  }

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();

  switch (unit) {
    case "s":
      return amount;
    case "m":
      return amount * 60;
    case "h":
      return amount * 60 * 60;
    case "d":
      return amount * 60 * 60 * 24;
    default:
      return 15 * 60;
  }
}

@Injectable()
export class TokenService {
  private sign(payload: TokenPayload, secret: string, expiresInSeconds: number) {
    const now = Math.floor(Date.now() / 1000);
    const header = encodeBase64Url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const body = encodeBase64Url(
      JSON.stringify({
        ...payload,
        iat: now,
        exp: now + expiresInSeconds,
      }),
    );
    const signature = encodeBase64Url(
      createHmac("sha256", secret).update(`${header}.${body}`).digest(),
    );

    return `${header}.${body}.${signature}`;
  }

  private verifySignature(token: string, secret: string) {
    const [header, body, signature] = token.split(".");
    if (!header || !body || !signature) {
      return null;
    }

    const expected = createHmac("sha256", secret).update(`${header}.${body}`).digest();
    const actual = Buffer.from(signature.replace(/-/g, "+").replace(/_/g, "/"), "base64");

    if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
      return null;
    }

    const payload = JSON.parse(decodeBase64Url(body)) as TokenPayload;
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  }

  issueAccessToken(payload: Omit<TokenPayload, "type">) {
    const config = getAppConfig();
    return this.sign(
      { ...payload, type: "access" },
      config.auth.jwtSecret,
      parseDurationToSeconds(config.auth.accessTokenTtl),
    );
  }

  issueRefreshToken(payload: Omit<TokenPayload, "type"> & { sessionId: string }) {
    const config = getAppConfig();
    return this.sign(
      { ...payload, type: "refresh" },
      config.auth.refreshTokenSecret,
      config.auth.refreshTokenTtlDays * 24 * 60 * 60,
    );
  }

  verifyAccessToken(token: string) {
    const config = getAppConfig();
    return this.verifySignature(token, config.auth.jwtSecret);
  }

  verifyRefreshToken(token: string) {
    const config = getAppConfig();
    return this.verifySignature(token, config.auth.refreshTokenSecret);
  }
}
