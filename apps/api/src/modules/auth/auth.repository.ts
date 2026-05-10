import { createHash } from "node:crypto";

import { Injectable } from "@nestjs/common";
import { UserStatus } from "@prisma/client";

import { PrismaService } from "@/database/prisma.service";

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async createSession(params: {
    userId: string;
    refreshToken: string;
    userAgent?: string;
    ipAddress?: string;
    expiresAt: Date;
  }) {
    return this.prisma.userSession.create({
      data: {
        userId: params.userId,
        tokenHash: createHash("sha256").update(params.refreshToken).digest("hex"),
        userAgent: params.userAgent,
        ipAddress: params.ipAddress,
        expiresAt: params.expiresAt,
      },
    });
  }

  async findSessionByRefreshToken(refreshToken: string) {
    return this.prisma.userSession.findUnique({
      where: {
        tokenHash: createHash("sha256").update(refreshToken).digest("hex"),
      },
      include: {
        user: true,
      },
    });
  }

  async revokeSessionByRefreshToken(refreshToken: string) {
    const tokenHash = createHash("sha256").update(refreshToken).digest("hex");

    return this.prisma.userSession.updateMany({
      where: {
        tokenHash,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  async replaceSessionRefreshToken(params: {
    sessionId: string;
    refreshToken: string;
    expiresAt: Date;
  }) {
    return this.prisma.userSession.update({
      where: { id: params.sessionId },
      data: {
        tokenHash: createHash("sha256").update(params.refreshToken).digest("hex"),
        expiresAt: params.expiresAt,
        revokedAt: null,
      },
    });
  }

  findActiveUsers() {
    return this.prisma.user.findMany({
      where: {
        status: UserStatus.ACTIVE,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}
