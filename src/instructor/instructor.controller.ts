import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Request,
  UseGuards,
  Param,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { InstructorService } from './instructor.service';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { UpdateInstructorDto } from './dto/update-instructor.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('v1/instructors')
export class InstructorController {
  constructor(private readonly instructorService: InstructorService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createInstructorDto: CreateInstructorDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.instructorService.create(createInstructorDto, file);
  }

  @Get()
  findAll() {
    return this.instructorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.instructorService.findOne(+id);
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
