import { Module } from '@nestjs/common';
import { InstructorService } from './instructor.service';
import { InstructorController } from './instructor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Instructor } from './entities/instructor.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { Exceptions } from 'src/common/Exceptions';
import { Course } from 'src/course/entities/course.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Instructor, Course]), CloudinaryModule],
  controllers: [InstructorController],
  providers: [InstructorService, Exceptions],
})
export class InstructorModule {}
