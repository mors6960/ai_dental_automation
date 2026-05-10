import { Body, Controller, Param, Post } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { executeControllerAction } from "@/common/utils/response.util";

import {
  AUTOMATION_MODULE,
  AUTOMATION_WORKFLOW_NAMES,
} from "@/modules/automation/automation.constants";
import { N8nWorkflowCallbackDto } from "@/modules/automation/dto/n8n-workflow-callback.dto";
import { AutomationService } from "@/modules/automation/automation.service";

@ApiTags("Automation")
@Controller(AUTOMATION_MODULE.controller)
export class AutomationController {
  constructor(private readonly automationService: AutomationService) {}

  @Post("n8n/callbacks/:workflow")
  @ApiOperation({ summary: "Receive workflow callback from n8n" })
  @ApiOkResponse({ description: "n8n callback processed successfully." })
  async receiveN8nCallback(
    @Param("workflow") workflow: string,
    @Body() payload: N8nWorkflowCallbackDto,
  ) {
    return executeControllerAction(() =>
      this.automationService.receiveN8nCallback(
        this.normalizeWorkflowName(workflow),
        payload,
      ),
    );
  }

  private normalizeWorkflowName(workflow: string) {
    return workflow.trim().toLowerCase();
  }
}
