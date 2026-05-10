import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { createServicePayload, executeServiceAction } from "@/common/utils/response.util";

import { PasswordService } from "@/common/auth/password.service";
import { TokenService } from "@/common/auth/token.service";
import { getAppConfig } from "@/config/configuration";
import { AUTH_ERROR_MESSAGES } from "@/modules/auth/constants/auth-error-messages";
import { AUTH_SUCCESS_MESSAGES } from "@/modules/auth/constants/auth-success-messages";
import { AuthRepository } from "@/modules/auth/auth.repository";
import { LoginDto } from "@/modules/auth/dto/login.dto";
import { LogoutDto } from "@/modules/auth/dto/logout.dto";
import { RefreshTokenDto } from "@/modules/auth/dto/refresh-token.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
  ) {}

  async login(payload: LoginDto) {
    return executeServiceAction({
      fallbackMessage: AUTH_ERROR_MESSAGES.loginFailed,
      action: async () => {
        const user = await this.authRepository.findByEmail(payload.email);
        const isValidPassword = this.passwordService.verify(
          payload.password,
          user?.passwordHash,
        );

        if (!user || !isValidPassword) {
          throw new HttpException(
            AUTH_ERROR_MESSAGES.invalidCredentials,
            HttpStatus.UNAUTHORIZED,
          );
        }

        const accessToken = this.tokenService.issueAccessToken({
          sub: user.id,
          email: user.email,
          role: user.role,
          clinicId: user.clinicId,
        });
        const sessionExpiry = new Date(
          Date.now() + getAppConfig().auth.refreshTokenTtlDays * 24 * 60 * 60 * 1000,
        );
        const bootstrapRefreshToken = this.tokenService.issueRefreshToken({
          sub: user.id,
          email: user.email,
          role: user.role,
          clinicId: user.clinicId,
          sessionId: "bootstrap",
        });
        const session = await this.authRepository.createSession({
          userId: user.id,
          refreshToken: bootstrapRefreshToken,
          expiresAt: sessionExpiry,
        });
        const refreshToken = this.tokenService.issueRefreshToken({
          sub: user.id,
          email: user.email,
          role: user.role,
          clinicId: user.clinicId,
          sessionId: session.id,
        });
        await this.authRepository.replaceSessionRefreshToken({
          sessionId: session.id,
          refreshToken,
          expiresAt: sessionExpiry,
        });

        return createServicePayload(AUTH_SUCCESS_MESSAGES.login, {
          accessToken,
          refreshToken,
          user: {
            id: user.id,
            email: user.email,
            fullName: `${user.firstName} ${user.lastName}`.trim(),
            role: user.role,
          },
        });
      },
    });
  }

  async refresh(payload: RefreshTokenDto) {
    return executeServiceAction({
      fallbackMessage: AUTH_ERROR_MESSAGES.refreshFailed,
      action: async () => {
        const tokenPayload = this.tokenService.verifyRefreshToken(payload.refreshToken);
        if (!tokenPayload || tokenPayload.type !== "refresh" || !tokenPayload.sessionId) {
          throw new HttpException(
            AUTH_ERROR_MESSAGES.invalidCredentials,
            HttpStatus.UNAUTHORIZED,
          );
        }

        const session = await this.authRepository.findSessionByRefreshToken(
          payload.refreshToken,
        );
        if (
          !session ||
          session.revokedAt ||
          session.expiresAt.getTime() < Date.now() ||
          session.userId !== tokenPayload.sub
        ) {
          throw new HttpException(
            AUTH_ERROR_MESSAGES.invalidCredentials,
            HttpStatus.UNAUTHORIZED,
          );
        }

        const accessToken = this.tokenService.issueAccessToken({
          sub: session.user.id,
          email: session.user.email,
          role: session.user.role,
          clinicId: session.user.clinicId,
        });
        const refreshToken = this.tokenService.issueRefreshToken({
          sub: session.user.id,
          email: session.user.email,
          role: session.user.role,
          clinicId: session.user.clinicId,
          sessionId: session.id,
        });
        const expiresAt = new Date(
          Date.now() + getAppConfig().auth.refreshTokenTtlDays * 24 * 60 * 60 * 1000,
        );

        await this.authRepository.replaceSessionRefreshToken({
          sessionId: session.id,
          refreshToken,
          expiresAt,
        });

        createServicePayload(AUTH_SUCCESS_MESSAGES.refresh, {
          accessToken,
          refreshToken,
        });
      },
    });
  }

  async logout(payload: LogoutDto) {
    return executeServiceAction({
      fallbackMessage: AUTH_ERROR_MESSAGES.logoutFailed,
      action: async () => {
        await this.authRepository.revokeSessionByRefreshToken(payload.refreshToken);

        createServicePayload(AUTH_SUCCESS_MESSAGES.logout, {
          loggedOut: true,
        });
      },
    });
  }

  async me(userId: string) {
    return executeServiceAction({
      fallbackMessage: AUTH_ERROR_MESSAGES.loginFailed,
      action: async () => {
        const user = await this.authRepository.findById(userId);
        if (!user) {
          throw new HttpException(AUTH_ERROR_MESSAGES.invalidCredentials, HttpStatus.UNAUTHORIZED);
        }

        return createServicePayload("Current user fetched successfully.", {
          id: user.id,
          clinicId: user.clinicId,
          email: user.email,
          fullName: `${user.firstName} ${user.lastName}`.trim(),
          role: user.role,
          status: user.status,
        });
      },
    });
  }
}
