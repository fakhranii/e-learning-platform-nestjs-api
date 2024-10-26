import {
  Controller,
  Request,
  Post,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('v1/reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UseGuards(AuthGuard)
  @Post(':slug')
  create(
    @Request() req,
    @Param('slug') slug: string,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return this.reviewService.create(req, slug, createReviewDto);
  }

  @UseGuards(AuthGuard)
  @Patch(':reviewId')
  update(
    @Request() req,
    @Param('reviewId') reviewId: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewService.update(req, +reviewId, updateReviewDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':slug/:reviewId')
  remove(
    @Request() req,
    @Param('slug') slug: string,
    @Param('reviewId') reviewId: string,
  ) {
    return this.reviewService.remove(req, slug, +reviewId);
  }

  @Get('instructor/:username/')
  findInstructorCoursesReviews(@Param('username') username: string) {
    return this.reviewService.findInstructorCoursesReviews(username);
  }
}
