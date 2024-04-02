import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Course } from 'src/course/entities/course.entity';
import { Instructor } from 'src/instructor/entities/instructor.entity';
<<<<<<< HEAD
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    CloudinaryModule,
    TypeOrmModule.forFeature([User, Course, Instructor]),
  ], //* to use it as repo
=======

@Module({
  imports: [TypeOrmModule.forFeature([User, Course, Instructor])], //* to use it as repo
>>>>>>> 65018de (init)
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
