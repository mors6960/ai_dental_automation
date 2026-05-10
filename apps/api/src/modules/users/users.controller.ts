import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

import { AccessTokenGuard } from "@/common/guards/access-token.guard";
import { RolesGuard } from "@/common/guards/roles.guard";
import { Roles } from "@/common/decorators/roles.decorator";
import { executeControllerAction } from "@/common/utils/response.util";
import { AuthUserRole } from "@/modules/auth/constants/auth.constants";
import { UsersService } from "@/modules/users/users.service";

@ApiTags("Users")
@Controller("users")
@UseGuards(AccessTokenGuard, RolesGuard)
@Roles(AuthUserRole.OWNER, AuthUserRole.ADMIN)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: "Fetch clinic users" })
  @ApiOkResponse({ description: "Users fetched successfully." })
  async findAll() {
    return executeControllerAction(() => this.usersService.findAll());
  }
}
