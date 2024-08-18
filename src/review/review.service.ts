import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { User } from '../user/entities/user.entity';
import { Course } from 'src/course/entities/course.entity';
import { Review } from './entities/review.entity';
import { Instructor } from 'src/instructor/entities/instructor.entity';
import { Exceptions } from '../utils/Exceptions';

@Injectable()
export class ReviewService {
  constructor(
    private readonly exceptions: Exceptions,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Course) private readonly courseRepo: Repository<Course>,
    @InjectRepository(Review) private readonly reviewRepo: Repository<Review>,
    @InjectRepository(Instructor)
    private readonly instructorRepo: Repository<Instructor>,
  ) {}
  async create(
    req: any,
    slug: string,
    createReviewDto: CreateReviewDto,
  ): Promise<Review> {
    const { id } = req.user;
    const user = await this.userRepo.findOneBy({ id: id });
    if (!user) throw this.exceptions.userNotFound;
    const course = await this.courseRepo.findOne({
      where: { slug },
      relations: ['courseCreator'],
    });
    if (!course) throw this.exceptions.courseNotFound;
    const courseCreator = course.courseCreator.id;
    console.log(courseCreator);
    const instructor = await this.instructorRepo.findOneBy({
      id: courseCreator,
    });
    if (!instructor) throw this.exceptions.instructorNotFound;
    const reviews = new Review();
    reviews.reviewCreator = user;
    reviews.course = course;
    instructor.ratingsCount++;
    course.numberOfRatings++;
    Object.assign(reviews, createReviewDto);
    await this.courseRepo.save(course);
    await this.instructorRepo.save(instructor);
    return await this.reviewRepo.save(reviews);
  }

  async update(req: any, reviewId: number, updateReviewDto: UpdateReviewDto) {
    const { id } = req.user;
    const user = await this.userRepo.findOneBy({ id });
    if (!user) throw this.exceptions.userNotFound;
    const review = await this.reviewRepo.findOneBy({ id: reviewId });
    if (!review) throw this.exceptions.reviewNotFound;
    if (user.id !== review.reviewCreator.id) throw this.exceptions.userNotFound;
    Object.assign(review, updateReviewDto);
    return await this.reviewRepo.save(review);
  }

  async remove(req: any, slug: string) {
    const { id } = req.user;
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['reviews'],
    });
    if (!user) this.exceptions.userNotFound;
    const deletedReviews = user.reviews.splice(-1);
    const course = await this.courseRepo.findOneBy({ slug });
    if (!course) throw this.exceptions.courseNotFound;
    if (course && user) {
      course.numberOfRatings--;
      await this.courseRepo.save(course);
      return await this.reviewRepo.remove(deletedReviews);
    }
    throw this.exceptions.courseNotFound;
  }

  async findInstructorCoursesReviews(username: string): Promise<any> {
    const instructor = await this.instructorRepo.findOne({
      where: { username },
      relations: ['courses', 'courses.reviews.reviewCreator'],
    });
    if (!instructor.isInstructor) throw this.exceptions.instructorNotFound;
    return instructor;
  }
}
