import { FileInterceptor } from '@nestjs/platform-express';

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('v1/courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post()
  create(
    @Request() req,
    @Body() createCourseDto: CreateCourseDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.courseService.create(req, createCourseDto, file);
  }

  @UseGuards(AuthGuard)
  @Get('instructor')
  findInstructorCourses(@Request() req) {
    return this.courseService.findInstructorCourses(req);
  }

  @Get()
  findAll(@Query('type') type: string) {
    return this.courseService.findAll(type);
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.courseService.findOne(slug);
  }

  @Get('/:slug/reviews')
  allCourseReviews(@Param('slug') slug: string) {
    return this.courseService.allCourseReviews(slug);
  }

  @UseGuards(AuthGuard)
  @Post('/:slug/enroll')
  enrollCourse(@Request() req, @Param('slug') slug: string) {
    return this.courseService.enrollCourse(req, slug);
  }

  @UseGuards(AuthGuard)
  @Delete('/:slug/unenroll')
  unEnrollCourse(@Request() req, @Param('slug') slug: string) {
    return this.courseService.unEnrollCourse(req, slug);
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Patch(':slug')
  update(
    @Request() req,
    @Param('slug') slug: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.courseService.update(req, slug, updateCourseDto, file);
  }

  @UseGuards(AuthGuard)
  @Delete(':slug')
  remove(@Request() req, @Param('slug') slug: string) {
    return this.courseService.remove(req, slug);
  }

  @UseGuards(AuthGuard)
  @Delete(':slug/thumbnail')
  removeThumbnail(@Request() req, @Param('slug') slug: string) {
    return this.courseService.removeThumbnail(req, slug);
  }
}
