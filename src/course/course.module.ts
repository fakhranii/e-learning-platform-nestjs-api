import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { Course } from './entities/course.entity';
import { User } from 'src/user/entities/user.entity';
import { Instructor } from 'src/instructor/entities/instructor.entity';
import { Review } from 'src/review/entities/review.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { UserService } from 'src/user/user.service';
import { Exceptions } from 'src/utils/Exceptions';

@Module({
  imports: [
    CloudinaryModule,
    TypeOrmModule.forFeature([User, Instructor, Course, Review]), // database operations
  ],
  controllers: [CourseController],
  providers: [CourseService, UserService, Exceptions],
})
export class CourseModule {}
