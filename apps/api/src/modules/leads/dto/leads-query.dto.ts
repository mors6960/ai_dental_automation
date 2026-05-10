import { IsEnum, IsOptional, IsString } from "class-validator";

import { LeadSource, LeadStatus } from "@/modules/leads/constants/leads.constants";

export class LeadsQueryDto {
  @IsOptional()
  @IsEnum(LeadStatus)
  status?: LeadStatus;

  @IsOptional()
  @IsEnum(LeadSource)
  source?: LeadSource;

  @IsOptional()
  @IsString()
  search?: string;
}
