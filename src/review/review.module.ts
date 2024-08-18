import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { User } from 'src/user/entities/user.entity';
import { Course } from 'src/course/entities/course.entity';
import { Review } from './entities/review.entity';
import { Instructor } from 'src/instructor/entities/instructor.entity';
import { Exceptions } from 'src/utils/Exceptions';

@Module({
  imports: [TypeOrmModule.forFeature([User, Course, Review, Instructor])],
  controllers: [ReviewController],
  providers: [ReviewService, Exceptions],
})
export class ReviewModule {}
