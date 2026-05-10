import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { executeControllerAction } from "@/common/utils/response.util";

import { LEADS_MODULE } from "@/modules/leads/constants/leads.constants";
import { CreateLeadDto } from "@/modules/leads/dto/create-lead.dto";
import { LeadsQueryDto } from "@/modules/leads/dto/leads-query.dto";
import { UpdateLeadDto } from "@/modules/leads/dto/update-lead.dto";
import { LeadsService } from "@/modules/leads/leads.service";

@ApiTags("Leads")
@Controller(LEADS_MODULE.controller)
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  @ApiOperation({ summary: "Create a new lead" })
  @ApiOkResponse({ description: "Lead created successfully." })
  async create(@Body() createLeadDto: CreateLeadDto) {
    return executeControllerAction(() => this.leadsService.create(createLeadDto));
  }

  @Get()
  @ApiOperation({ summary: "Fetch all leads with optional filters" })
  @ApiOkResponse({ description: "Leads fetched successfully." })
  async findAll(@Query() query: LeadsQueryDto) {
    return executeControllerAction(() => this.leadsService.findAll(query));
  }

  @Get(":id")
  @ApiOperation({ summary: "Fetch a single lead by id" })
  @ApiOkResponse({ description: "Lead details fetched successfully." })
  async findOne(@Param("id") id: string) {
    return executeControllerAction(() => this.leadsService.findOne(id));
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a lead by id" })
  @ApiOkResponse({ description: "Lead updated successfully." })
  async update(@Param("id") id: string, @Body() updateLeadDto: UpdateLeadDto) {
    return executeControllerAction(() => this.leadsService.update(id, updateLeadDto));
  }
}
