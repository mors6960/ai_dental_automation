import { Module } from "@nestjs/common";

import { PasswordService } from "@/common/auth/password.service";
import { TokenService } from "@/common/auth/token.service";
import { AccessTokenGuard } from "@/common/guards/access-token.guard";
import { RolesGuard } from "@/common/guards/roles.guard";
import { AuthController } from "@/modules/auth/auth.controller";
import { AuthRepository } from "@/modules/auth/auth.repository";
import { AuthService } from "@/modules/auth/auth.service";

@Module({
  controllers: [AuthController],
  providers: [
    AuthRepository,
    AuthService,
    PasswordService,
    TokenService,
    AccessTokenGuard,
    RolesGuard,
  ],
  exports: [AuthService, AuthRepository, PasswordService, TokenService, AccessTokenGuard, RolesGuard],
})
export class AuthModule {}
