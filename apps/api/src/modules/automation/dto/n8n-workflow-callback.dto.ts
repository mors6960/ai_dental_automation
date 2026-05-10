import { IsIn, IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator";

import { AUTOMATION_WORKFLOW_NAMES } from "@/modules/automation/automation.constants";

const WORKFLOW_NAMES = Object.values(AUTOMATION_WORKFLOW_NAMES);

export class N8nWorkflowCallbackDto {
  @IsString()
  @IsIn(WORKFLOW_NAMES)
  workflow!: string;

  @IsString()
  @IsNotEmpty()
  eventName!: string;

  @IsOptional()
  @IsString()
  entityId?: string;

  @IsOptional()
  @IsString()
  workflowExecutionId?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsObject()
  payload?: Record<string, unknown>;
}
