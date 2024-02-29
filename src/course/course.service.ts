import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
    const user = await this.userSrv.findOne(req.user.id);
    // console.log(req.user);
    console.log(user);
    const newCourse = new Course();
    newCourse.user = user;
    Object.assign(newCourse, createCourseDto);
    return await this.courseRepo.save(newCourse);
  }

  async findAll(): Promise<Course[]> {
    return await this.courseRepo.find();
  }

  async findOne(req: any, id: number): Promise<Course> {
    const user = await this.userSrv.findOne(req.user.id);
    if (user) {
      return await this.courseRepo.findOneBy({ id });
    } else {
      throw new HttpException(
        " You're Not Authorized",
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async update(
    req: any,
    id: number,
    updateCourseDto: UpdateCourseDto,
  ): Promise<Course> {
    const user = await this.userSrv.findOne(req.user.id);
    if (user) {
      const course = await this.courseRepo.findOneBy({ id });
      Object.assign(course, updateCourseDto);
      return await this.courseRepo.save(course);
    } else {
      throw new HttpException(
        " You're Not Authorized",
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async remove(req: any, id: number) {
    const user = await this.userSrv.findOne(req.user.id);
    if (user) {
      return this.courseRepo.delete(id);
    } else {
      throw new HttpException(
        " You're Not Authorized",
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
