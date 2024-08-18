import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Course } from 'src/course/entities/course.entity';
import { Instructor } from 'src/instructor/entities/instructor.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { Exceptions } from 'src/utils/Exceptions';

@Module({
  imports: [
    CloudinaryModule,
    TypeOrmModule.forFeature([User, Course, Instructor]),
  ], //* to use it as repo
  controllers: [UserController],
  providers: [UserService, Exceptions],
  exports: [UserService],
})
export class UserModule {}
