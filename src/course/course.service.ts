import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course) private readonly courseRepo: Repository<Course>,
    private readonly userSrv: UserService,
  ) {}
  async create(req: any, createCourseDto: CreateCourseDto): Promise<Course> {
    const newCourse = new Course();
    Object.assign(newCourse, createCourseDto);
    return await this.courseRepo.save(newCourse);
  }

  async findAll(): Promise<Course[]> {
    return await this.courseRepo.find();
  }

  async findOne(req: any, courseId: number): Promise<Course> {
    return await this.courseRepo.findOneBy({ id: courseId });
  }

  async update(
    req: any,
    courseId: number,
    updateCourseDto: UpdateCourseDto,
  ): Promise<Course> {
    const course = await this.courseRepo.findOneBy({ id: courseId });
    Object.assign(course, updateCourseDto);
    return await this.courseRepo.save(course);
  }

  async remove(req: any, courseId: number) {
    return this.courseRepo.delete(courseId);
  }
}
