import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "@/common/decorators/current-user.decorator";
import { Public } from "@/common/decorators/public.decorator";
import { AccessTokenGuard } from "@/common/guards/access-token.guard";
import { executeControllerAction } from "@/common/utils/response.util";

import { AUTH_MODULE } from "@/modules/auth/constants/auth.constants";
import { AuthService } from "@/modules/auth/auth.service";
import { LoginDto } from "@/modules/auth/dto/login.dto";
import { LogoutDto } from "@/modules/auth/dto/logout.dto";
import { RefreshTokenDto } from "@/modules/auth/dto/refresh-token.dto";

@ApiTags("Auth")
@Controller(AUTH_MODULE.controller)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("login")
  @ApiOperation({ summary: "Login admin or staff user" })
  @ApiOkResponse({ description: "Login completed successfully." })
  async login(@Body() payload: LoginDto) {
    return executeControllerAction(() => this.authService.login(payload));
  }

  @Public()
  @Post("refresh")
  @ApiOperation({ summary: "Refresh auth session tokens" })
  @ApiOkResponse({ description: "Session refreshed successfully." })
  async refresh(@Body() payload: RefreshTokenDto) {
    return executeControllerAction(() => this.authService.refresh(payload));
  }

  @Public()
  @Post("logout")
  @ApiOperation({ summary: "Logout current user session" })
  @ApiOkResponse({ description: "Logout completed successfully." })
  async logout(@Body() payload: LogoutDto) {
    return executeControllerAction(() => this.authService.logout(payload));
  }

  @Get("me")
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: "Fetch the current authenticated user" })
  @ApiOkResponse({ description: "Current user fetched successfully." })
  async me(@CurrentUser("id") userId: string) {
    return executeControllerAction(() => this.authService.me(userId));
  }
}
