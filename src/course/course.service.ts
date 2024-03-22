import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { Repository } from 'typeorm';
import { Instructor } from 'src/instructor/entities/instructor.entity';
import { Review } from 'src/review/entities/review.entity';
import { User } from 'src/user/entities/user.entity';
import { calculatePercentage } from 'src/common/calculate-percentage';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Course) private readonly courseRepo: Repository<Course>,
    @InjectRepository(Review) private readonly reviewRepo: Repository<Review>,
    @InjectRepository(Instructor)
    private readonly instructorRepo: Repository<Instructor>,
  ) {}

  async create(req: any, createCourseDto: CreateCourseDto): Promise<Course> {
    const { id } = req.user;
    const instructor = await this.instructorRepo.findOneBy({ id });
    if (!instructor.isInstructor) {
      throw new HttpException(
        'you are not allowed',
        HttpStatus.METHOD_NOT_ALLOWED,
      );
    }
    const newCourse = new Course();
    instructor.coursesCount++;
    newCourse.courseCreator = instructor;
    Object.assign(newCourse, createCourseDto);
    await this.instructorRepo.save(instructor);
    return await this.courseRepo.save(newCourse);
  }
  async enrollCourse(req: any, slug: string) {
    const { id } = req.user;
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['courses'],
    });
    const course = await this.courseRepo.findOneBy({ slug });
    const isCourseEnrolled = course.numberOfStudents;
    const courseCreator = course.courseCreator.id;
    const instructor = await this.instructorRepo.findOneBy({
      id: courseCreator,
    });

    if (isCourseEnrolled > 0) {
      throw new HttpException(
        `You're already enrolled`,
        HttpStatus.METHOD_NOT_ALLOWED,
      );
    }
    instructor.studentsCount++;
    course.courseCreator.studentsCount++;
    course.numberOfStudents++;
    user.courses.push(course);
    await this.instructorRepo.save(instructor);
    await this.userRepo.save(user);
    await this.courseRepo.save(course);
    return course;
  }

  async unEnrollCourse(req: any, slug: string) {
    const { id } = req.user;
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['courses'],
    });
    const course = await this.courseRepo.findOneBy({ slug });
    const isCourseEnrolled = course.numberOfStudents;

    if (isCourseEnrolled > 0 && isCourseEnrolled !== 0) {
      user.courses.splice(isCourseEnrolled[1], 1);
      course.numberOfStudents--;
      await this.courseRepo.save(course);
      await this.userRepo.save(user);
      return course;
    }
    throw new HttpException(`It's not enrolled`, HttpStatus.METHOD_NOT_ALLOWED);
  }

  async allCourseReviews(slug: string): Promise<Review[]> {
    const course = await this.courseRepo.findOne({
      where: { slug },
      relations: ['reviews'],
    });
    return course.reviews;
  }

  async findAll(): Promise<Course[]> {
    return await this.courseRepo.find();
  }

  async findOne(courseId: number): Promise<object> {
    const course = await this.courseRepo.findOne({
      where: { id: courseId },
      relations: ['reviews', 'courseCreator'],
    });
    const ratingReviews = course.reviews;
    const ratingsPersentage = calculatePercentage(ratingReviews);

    if (!course) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    return { ratingsPersentage, course };
  }

  async update(
    req: any,
    courseId: number,
    updateCourseDto: UpdateCourseDto,
  ): Promise<Course> {
    const { id } = req.user;
    const instructor = await this.instructorRepo.findOneBy({ id });
    if (!instructor.isInstructor) {
      throw new HttpException(
        'you are not allowed',
        HttpStatus.METHOD_NOT_ALLOWED,
      );
    }
    const course = await this.courseRepo.findOneBy({ id: courseId });
    Object.assign(course, updateCourseDto);
    return await this.courseRepo.save(course);
  }

  async remove(req: any, courseId: number) {
    const { id } = req.user;
    const instructor = await this.instructorRepo.findOneBy({ id });
    if (!instructor.isInstructor) {
      throw new HttpException(
        'you are not allowed',
        HttpStatus.METHOD_NOT_ALLOWED,
      );
    }
    return this.courseRepo.delete(courseId);
  }
}
