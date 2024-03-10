import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Course } from 'src/course/entities/course.entity';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Course) private readonly courseRepo: Repository<Course>,
    @InjectRepository(Review) private readonly reviewRepo: Repository<Review>,
  ) {}
  async create(
    req: any,
    slug: string,
    createReviewDto: CreateReviewDto,
  ): Promise<Review> {
    const { id } = req.user;
    const user = await this.userRepo.findOneBy({ id });
    const course = await this.courseRepo.findOneBy({ slug });
    if (!user) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
    const reviews = new Review();
    reviews.creator = user;
    reviews.course = course;
    Object.assign(reviews, createReviewDto);
    return await this.reviewRepo.save(reviews);
  }

  async update(req: any, slug: string, updateReviewDto: UpdateReviewDto) {
  }

  remove(req: any, slug: string) {
    return `This action removes a  review`;
  }
}
