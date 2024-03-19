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

  /**
   * @desc   create a new Course by  the current user
   * @route  /v1/course/:id
   * @method POST
   * @access private
   */
  @UseGuards(AuthGuard)
  @Post()
  create(@Request() req, @Body() createCourseDto: CreateCourseDto) {
    return this.courseService.create(req, createCourseDto);
  }

  /**
   * @desc   find all courses
   * @route  /v1/course/:id
   * @method GET
   * @access private
   */
  @Get()
  findAll() {
    return this.courseService.findAll();
  }

  /**
   * @desc   find one course by id
   * @route  /v1/course/:id
   * @method GET
   * @access private
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courseService.findOne(+id);
  }

  @Get('reviews/:slug')
  allCourseReviews(@Param('slug') slug: string) {
    return this.courseService.allCourseReviews(slug);
  }

  /**
   * @desc   update a course  only by creator or admin
   * @route  /v1/course/:id
   * @method PATCH
   * @access private
   */
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return this.courseService.update(req, +id, updateCourseDto);
  }

  /**
   * @desc   delete a course only by creator or admin
   * @route  /v1/course/:id
   * @method DELETE
   * @access private
   */
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.courseService.remove(req, +id);
  }
}
