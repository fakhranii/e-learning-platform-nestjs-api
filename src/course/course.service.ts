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
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Exceptions } from '../common/Exceptions';

@Injectable()
export class CourseService {
  constructor(
    private readonly exceptions: Exceptions,
    private readonly cloudinarySrv: CloudinaryService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Course) private readonly courseRepo: Repository<Course>,
    @InjectRepository(Instructor)
    private readonly instructorRepo: Repository<Instructor>,
  ) {}

  async create(
    req: any,
    createCourseDto: CreateCourseDto,
    file: Express.Multer.File,
  ): Promise<Course> {
    const { id } = req.user;
    const instructor = await this.instructorRepo.findOneBy({ id });
    if (!instructor.isInstructor) throw this.exceptions.instructorNotFound;
    const newCourse = new Course();
    newCourse.courseCreator = instructor;
    Object.assign(newCourse, createCourseDto);
    newCourse.isCertified = createCourseDto.isCertified === 'true';
    instructor.coursesCount++;
    await this.instructorRepo.save(instructor);
    if (file) {
      newCourse.thumbnails = (
        await this.cloudinarySrv.uploadFile(file)
      ).secure_url;
    }
    return await this.courseRepo.save(newCourse);
  }

  async enrollCourse(req: any, slug: string) {
    const { id } = req.user;
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['courses'],
    });
    if (!user) throw this.exceptions.userNotFound;
    const course = await this.courseRepo.findOneBy({ slug });
    if (!course) throw this.exceptions.courseNotFound;
    const courseCreator = course.courseCreator.id;
    const instructor = await this.instructorRepo.findOneBy({
      id: courseCreator,
    });
    if (!instructor) throw this.exceptions.instructorNotFound;
    const isCourseEnrolled = user.courses.some(
      (enrolledCourse) => enrolledCourse.id === course.id,
    );
    if (isCourseEnrolled) {
      throw new HttpException(
        `You're already enrolled`,
        HttpStatus.METHOD_NOT_ALLOWED,
      );
    }
    user.courses.push(course);
    instructor.studentsCount++;
    course.courseCreator.studentsCount++;
    course.numberOfStudents++;
    await this.userRepo.save(user);
    await this.instructorRepo.save(instructor);
    await this.courseRepo.save(course);
    return course;
  }

  async unEnrollCourse(req: any, slug: string) {
    const { id } = req.user;
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['courses'],
    });
    if (!user) throw this.exceptions.userNotFound;
    const course = await this.courseRepo.findOneBy({ slug });
    if (!course) throw this.exceptions.courseNotFound;
    const courseCreator = course.courseCreator.id;
    const instructor = await this.instructorRepo.findOneBy({
      id: courseCreator,
    });
    if (!instructor) throw this.exceptions.instructorNotFound;
    const isCourseEnrolled = user.courses.some(
      (enrolledCourse) => enrolledCourse.id === course.id,
    );
    if (!isCourseEnrolled) {
      throw new HttpException(
        `You're not enrolled`,
        HttpStatus.METHOD_NOT_ALLOWED,
      );
    }
    user.courses.splice(isCourseEnrolled[1], 1);
    instructor.studentsCount--;
    course.courseCreator.studentsCount--;
    course.numberOfStudents--;
    await this.courseRepo.save(course);
    await this.instructorRepo.save(instructor);
    await this.userRepo.save(user);
    return course;
  }

  async findInstructorCourses(req: any): Promise<Instructor> {
    const { id } = req.user;
    const instructor = await this.instructorRepo.findOne({
      where: { id },
      relations: ['courses'],
    });
    if (!instructor.isInstructor) throw this.exceptions.instructorNotFound;
    return instructor;
  }

  async allCourseReviews(
    slug: string,
  ): Promise<{ AllReviews: Review[]; course: Course }> {
    const course = await this.courseRepo.findOne({
      where: { slug },
      relations: ['reviews'],
    });
    if (!course) throw this.exceptions.courseNotFound;
    const AllReviews = course.reviews;
    return {
      course,
      AllReviews,
    };
  }

  async findAll(): Promise<Course[]> {
    return await this.courseRepo.find();
  }

  async findOne(
    slug: string,
  ): Promise<{ course: Course; ratingsPersentage: string }> {
    const course = await this.courseRepo.findOne({
      where: { slug },
      relations: ['reviews', 'courseCreator'],
    });
    if (!course) throw this.exceptions.courseNotFound;
    const ratingReviews = course.reviews;
    const ratingsPersentage = calculatePercentage(ratingReviews) || '0%';
    return { ratingsPersentage, course };
  }

  async update(
    req: any,
    courseId: number,
    updateCourseDto: UpdateCourseDto,
    file: Express.Multer.File,
  ): Promise<Course> {
    const { id } = req.user;
    const instructor = await this.instructorRepo.findOneBy({ id });
    if (!instructor.isInstructor) throw this.exceptions.instructorNotFound;
    const course = await this.courseRepo.findOneBy({ id: courseId });
    if (!course) throw this.exceptions.courseNotFound;
    Object.assign(course, updateCourseDto);
    if (file) {
      course.thumbnails = (
        await this.cloudinarySrv.uploadFile(file)
      ).secure_url;
    }
    return await this.courseRepo.save(course);
  }

  async remove(req: any, courseId: number) {
    const { id } = req.user;
    const instructor = await this.instructorRepo.findOneBy({ id });
    if (!instructor.isInstructor) throw this.exceptions.instructorNotFound;
    return this.courseRepo.delete(courseId);
  }

  async removeThumbnail(req: any, courseId: number) {
    const { id } = req.user;
    const instructor = await this.instructorRepo.findOneBy({ id });
    if (!instructor.isInstructor) throw this.exceptions.instructorNotFound;
    const course = await this.courseRepo.findOneBy({ id: courseId });
    if (!course) throw this.exceptions.courseNotFound;
    course.thumbnails = null;
    return await this.courseRepo.save(course);
  }
}
