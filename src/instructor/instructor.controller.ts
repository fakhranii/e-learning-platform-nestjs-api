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

  @Get(':username')
  findOne(@Param('username') username: string) {
    return this.instructorService.findOne(username);
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Patch()
  update(
    @Request() req,
    @Body() updateInstructorDto: UpdateInstructorDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.instructorService.update(req, updateInstructorDto, file);
  }

  @UseGuards(AuthGuard)
  @Delete()
  remove(@Request() req) {
    return this.instructorService.remove(req);
  }

  @UseGuards(AuthGuard)
  @Delete('/avatar')
  removeAvatar(@Request() req) {
    return this.instructorService.removeAvatar(req);
  }
}
