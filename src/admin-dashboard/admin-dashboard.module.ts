import { Module } from '@nestjs/common';
import { AdminDashboardService } from './admin-dashboard.service';
import { AdminDashboardController } from './admin-dashboard.controller';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../user/entities/user.entity';
import { Course } from '../course/entities/course.entity';
import { Instructor } from '../instructor/entities/instructor.entity';
import { Review } from 'src/review/entities/review.entity';
import { Exceptions } from 'src/utils/Exceptions';

@Module({
  imports: [TypeOrmModule.forFeature([User, Course, Instructor, Review])],
  controllers: [AdminDashboardController],
  providers: [AdminDashboardService, Exceptions],
})
export class AdminDashboardModule {}
