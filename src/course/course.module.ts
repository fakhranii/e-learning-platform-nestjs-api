import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { User } from 'src/user/entities/user.entity';
import { Instructor } from 'src/instructor/entities/instructor.entity';
import { Review } from 'src/review/entities/review.entity';
<<<<<<< HEAD
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [
    CloudinaryModule,
    TypeOrmModule.forFeature([User, Instructor, Course, Review]),
  ],
=======

@Module({
  imports: [TypeOrmModule.forFeature([User, Instructor, Course, Review])],
>>>>>>> 65018de (init)
  controllers: [CourseController],
  providers: [CourseService, UserService],
})
export class CourseModule {}
