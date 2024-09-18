import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
  Request,
  UseGuards,
  Param,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { InstructorService } from './instructor.service';
import { UpdateInstructorDto } from './dto/update-instructor.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('v1/instructors')
export class InstructorController {
  constructor(private readonly instructorService: InstructorService) {}

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
