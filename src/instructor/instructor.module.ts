import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Instructor } from './entities/instructor.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { Exceptions } from 'src/utils/Exceptions';
import { Course } from 'src/course/entities/course.entity';
import { InstructorService } from './instructor.service';
import { InstructorController } from './instructor.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Instructor, Course]), CloudinaryModule],
  controllers: [InstructorController],
  providers: [InstructorService, Exceptions],
})
export class InstructorModule {}
