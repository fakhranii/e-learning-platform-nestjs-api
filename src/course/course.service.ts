import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { Repository } from 'typeorm';
import { Instructor } from 'src/instructor/entities/instructor.entity';
import { Review } from 'src/review/entities/review.entity';

@Injectable()
export class CourseService {
  constructor(
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

  async findOne(courseId: number): Promise<Course> {
    const course = await this.courseRepo.findOne({
      where: { id: courseId },
      relations: ['reviews', 'courseCreator'],
    });
    if (!course) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return course;
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
