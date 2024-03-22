import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('v1/courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Request() req, @Body() createCourseDto: CreateCourseDto) {
    return this.courseService.create(req, createCourseDto);
  }

  @Get()
  findAll() {
    return this.courseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courseService.findOne(+id);
  }

  @Get('reviews/:slug')
  allCourseReviews(@Param('slug') slug: string) {
    return this.courseService.allCourseReviews(slug);
  }

  @UseGuards(AuthGuard)
  @Post('enroll/:slug')
  enrollCourse(@Request() req, @Param('slug') slug: string) {
    return this.courseService.enrollCourse(req, slug);
  }

  @UseGuards(AuthGuard)
  @Delete('unenroll/:slug')
  unEnrollCourse(@Request() req, @Param('slug') slug: string) {
    return this.courseService.unEnrollCourse(req, slug);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return this.courseService.update(req, +id, updateCourseDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.courseService.remove(req, +id);
  }
}
