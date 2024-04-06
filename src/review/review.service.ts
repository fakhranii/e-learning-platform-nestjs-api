import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Course } from 'src/course/entities/course.entity';
import { Review } from './entities/review.entity';
import { Instructor } from 'src/instructor/entities/instructor.entity';

@Injectable()
export class ReviewService {
  constructor(
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
    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const course = await this.courseRepo.findOneBy({ slug });
    if (!course) {
      throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
    }
    const courseCreator = course.courseCreator.id;
    const instructor = await this.instructorRepo.findOneBy({
      id: courseCreator,
    });
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
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const review = await this.reviewRepo.findOneBy({ id: reviewId });
    if (!review) {
      throw new HttpException('No reviews found', HttpStatus.NOT_FOUND);
    }
    console.log(user);
    if (user.id !== review.reviewCreator.id) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
    Object.assign(review, updateReviewDto);
    return await this.reviewRepo.save(review);
  }

  async remove(req: any, slug: string) {
    const { id } = req.user;
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['reviews'],
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const deletedReviews = user.reviews.splice(-1);
    const course = await this.courseRepo.findOneBy({ slug });
    if (!course) {
      throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
    }
    if (course && user) {
      course.numberOfRatings--;
      await this.courseRepo.save(course);
      return await this.reviewRepo.remove(deletedReviews);
    }
    throw new HttpException('user not found', HttpStatus.NOT_FOUND);
  }
}
