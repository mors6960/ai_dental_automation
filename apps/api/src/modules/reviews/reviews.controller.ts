import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { executeControllerAction } from "@/common/utils/response.util";

import { REVIEWS_MODULE } from "@/modules/reviews/constants/reviews.constants";
import { CreateReviewRequestDto } from "@/modules/reviews/dto/create-review-request.dto";
import { ReviewsService } from "@/modules/reviews/reviews.service";

@ApiTags("Reviews")
@Controller(REVIEWS_MODULE.controller)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post("request")
  @ApiOperation({ summary: "Create a review request" })
  @ApiOkResponse({ description: "Review request created successfully." })
  async createRequest(@Body() payload: CreateReviewRequestDto) {
    return executeControllerAction(() => this.reviewsService.createRequest(payload));
  }

  @Get()
  @ApiOperation({ summary: "Fetch review requests and reviews" })
  @ApiOkResponse({ description: "Reviews fetched successfully." })
  async findAll() {
    return executeControllerAction(() => this.reviewsService.findAll());
  }
}
