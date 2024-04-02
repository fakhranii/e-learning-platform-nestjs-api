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
<<<<<<< HEAD
  UseInterceptors,
  UploadedFile,
=======
>>>>>>> 65018de (init)
} from '@nestjs/common';
import { InstructorService } from './instructor.service';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { UpdateInstructorDto } from './dto/update-instructor.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
<<<<<<< HEAD
import { FileInterceptor } from '@nestjs/platform-express';
=======
>>>>>>> 65018de (init)

@Controller('v1/instructors')
export class InstructorController {
  constructor(private readonly instructorService: InstructorService) {}

  @Post()
<<<<<<< HEAD
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createInstructorDto: CreateInstructorDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.instructorService.create(createInstructorDto, file);
=======
  create(@Body() createInstructorDto: CreateInstructorDto) {
    return this.instructorService.create(createInstructorDto);
>>>>>>> 65018de (init)
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
<<<<<<< HEAD
  @UseInterceptors(FileInterceptor('file'))
  @Patch()
  update(
    @Request() req,
    @Body() updateInstructorDto: UpdateInstructorDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.instructorService.update(req, updateInstructorDto, file);
=======
  @Patch()
  update(@Request() req, @Body() updateInstructorDto: UpdateInstructorDto) {
    return this.instructorService.update(req, updateInstructorDto);
>>>>>>> 65018de (init)
  }

  @UseGuards(AuthGuard)
  @Delete()
  remove(@Request() req) {
    return this.instructorService.remove(req);
  }
<<<<<<< HEAD

  @UseGuards(AuthGuard)
  @Delete('/avatar')
  removeAvatar(@Request() req) {
    return this.instructorService.removeAvatar(req);
  }
=======
>>>>>>> 65018de (init)
}
