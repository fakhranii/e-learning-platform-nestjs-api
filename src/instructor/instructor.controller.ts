import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { InstructorService } from './instructor.service';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { UpdateInstructorDto } from './dto/update-instructor.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('v1/instructor')
export class InstructorController {
  constructor(private readonly instructorService: InstructorService) {}

  @Post()
  create(@Body() createInstructorDto: CreateInstructorDto) {
    return this.instructorService.create(createInstructorDto);
  }

  @Get()
  findAll() {
    return this.instructorService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('courses')
  findAllUserCourses(@Request() req) {
    return this.instructorService.findAllInstructorCourses(req);
  }

  @UseGuards(AuthGuard)
  @Patch()
  update(@Request() req, @Body() updateInstructorDto: UpdateInstructorDto) {
    return this.instructorService.update(req, updateInstructorDto);
  }

  @UseGuards(AuthGuard)
  @Delete()
  remove(@Request() req) {
    return this.instructorService.remove(req);
  }
}
