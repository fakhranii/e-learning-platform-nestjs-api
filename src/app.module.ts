import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { CourseModule } from './course/course.module';
import { AuthModule } from './auth/auth.module';
import { ReviewModule } from './review/review.module';
import { InstructorModule } from './instructor/instructor.module';

@Module({
  //? app module is the root module
  //* app module is the parent of the whole project, all moduls must be imported here!
  // all project modules.
  imports: [DatabaseModule, UserModule, CourseModule, AuthModule, ReviewModule, InstructorModule],
})
export class AppModule {}
