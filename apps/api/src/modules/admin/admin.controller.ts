import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

import { AccessTokenGuard } from "@/common/guards/access-token.guard";
import { RolesGuard } from "@/common/guards/roles.guard";
import { Roles } from "@/common/decorators/roles.decorator";
import { executeControllerAction } from "@/common/utils/response.util";
import { AdminService } from "@/modules/admin/admin.service";
import { AuthUserRole } from "@/modules/auth/constants/auth.constants";

@ApiTags("Admin")
@Controller("admin")
@UseGuards(AccessTokenGuard, RolesGuard)
@Roles(AuthUserRole.OWNER, AuthUserRole.ADMIN, AuthUserRole.STAFF)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get("summary")
  @ApiOperation({ summary: "Fetch MVP admin summary metrics" })
  @ApiOkResponse({ description: "Admin summary fetched successfully." })
  async getSummary() {
    return executeControllerAction(() => this.adminService.getSummary());
  }
}
