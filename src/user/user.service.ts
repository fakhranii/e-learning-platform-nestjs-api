import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  HttpException,
  HttpStatus,
  Injectable,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Course } from 'src/course/entities/course.entity';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Instructor } from 'src/instructor/entities/instructor.entity';

@Injectable()
export class UserService {
  constructor(
    // oop - first thing run in the file
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Course) private readonly courseRepo: Repository<Course>,
    @InjectRepository(Instructor)
    private readonly instructorRepo: Repository<Instructor>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    Object.assign(user, createUserDto);
    await this.userRepo.save(user);
    delete user.password;
    return user;
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

  async findAll(): Promise<User[]> {
    return this.userRepo.find(); // find all
  }

  async findOne(id: number): Promise<User> {
    return this.userRepo.findOne({ where: { id }, relations: ['courses'] });
  }

  @UseGuards(AuthGuard) // should have token to pass
  async update(req: any, updateUserDto: UpdateUserDto): Promise<User> {
    const { id } = req.user;
    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      throw new HttpException('Not allowed', HttpStatus.METHOD_NOT_ALLOWED);
    }
    Object.assign(user, updateUserDto); //  target , source
    return await this.userRepo.save(user);
  }

  async remove(req: any) {
    const { id } = req.user;
    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      throw new HttpException('Not allowed', HttpStatus.METHOD_NOT_ALLOWED);
    }
    return this.userRepo.delete(id);
  }
}
