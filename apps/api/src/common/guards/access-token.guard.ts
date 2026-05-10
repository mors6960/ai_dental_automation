import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import { AuthRepository } from "@/modules/auth/auth.repository";
import { IS_PUBLIC_KEY } from "@/common/decorators/public.decorator";
import { TokenService } from "@/common/auth/token.service";

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tokenService: TokenService,
    private readonly authRepository: AuthRepository,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{
      headers: Record<string, string | undefined>;
      user?: unknown;
    }>();
    const authorization = request.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
      throw new UnauthorizedException("Missing bearer token.");
    }

    const token = authorization.slice("Bearer ".length).trim();
    const payload = this.tokenService.verifyAccessToken(token);

    if (!payload || payload.type !== "access") {
      throw new UnauthorizedException("Invalid or expired access token.");
    }

    const user = await this.authRepository.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException("User not found for access token.");
    }

    request.user = {
      id: user.id,
      clinicId: user.clinicId,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    return true;
  }
}
