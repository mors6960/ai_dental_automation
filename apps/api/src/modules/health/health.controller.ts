import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Public } from "@/common/decorators/public.decorator";
import { executeControllerAction } from "@/common/utils/response.util";

import { HealthService } from "@/modules/health/health.service";

@ApiTags("Health")
@Controller("health")
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: "Check API health status" })
  @ApiOkResponse({ description: "Health status returned successfully." })
  async getHealth() {
    return executeControllerAction(() => this.healthService.getHealthStatus());
  }
}
