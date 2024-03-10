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

@Controller('v1/review')
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
  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewService.update(req, id, updateReviewDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':slug')
  remove(@Request() req, @Param(':slug') slug: string) {
    return this.reviewService.remove(req, slug);
  }
}
