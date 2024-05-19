import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { Repository } from 'typeorm';
import { Instructor } from 'src/instructor/entities/instructor.entity';
import { Review } from 'src/review/entities/review.entity';
import { User } from 'src/user/entities/user.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Exceptions } from '../common/Exceptions';

@Injectable()
export class CourseService {
  constructor(
    private readonly exceptions: Exceptions,
    private readonly cloudinarySrv: CloudinaryService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Review) private readonly reviewRepo: Repository<Review>,
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

    const title = ['title'];
    const missingTitle = title.filter((field) => !(field in createCourseDto));
    if (missingTitle.length > 0) {
      throw new HttpException(
        `Missing required fields: ${missingTitle.join(', ')}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const existingCourse = await this.courseRepo.findOneBy({
      title: createCourseDto.title,
    });
    if (existingCourse)
      throw new HttpException(
        'There is one course with the same title',
        HttpStatus.METHOD_NOT_ALLOWED,
      );

    const newCourse = new Course();
    const requiredFields = [
      'title',
      'courseDescription',
      'courseLink',
      'prerequisites',
      'category',
      'skillLevel',
    ];

    const missingFields = requiredFields.filter(
      (field) => !(field in createCourseDto),
    );
    if (missingFields.length > 0) {
      throw new HttpException(
        `Missing required fields: ${missingFields.join(', ')}`,
        HttpStatus.BAD_REQUEST,
      );
    }

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
    const course = await this.courseRepo.findOne({
      where: { slug },
      relations: ['courseCreator', 'reviews.reviewCreator'],
    });
    if (!course) throw this.exceptions.courseNotFound;
    const courseCreator = course.courseCreator;
    const instructor = await this.instructorRepo.findOneBy({
      id: courseCreator.id,
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
    // course.courseCreator.studentsCount++;
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
    const course = await this.courseRepo.findOne({
      where: { slug },
      relations: ['courseCreator', 'reviews.reviewCreator'],
    });
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
    if (instructor.studentsCount > 0) instructor.studentsCount--;
    // course.courseCreator.studentsCount--;
    if (course.numberOfStudents > 0) course.numberOfStudents--;
    await this.courseRepo.save(course);
    await this.instructorRepo.save(instructor);
    await this.userRepo.save(user);
    return course;
  }

  async findInstructorCourses(req: any): Promise<Course[]> {
    const { id } = req.user;
    const instructor = await this.instructorRepo.findOne({
      where: { id },
      relations: ['courses.reviews.reviewCreator'],
    });
    if (!instructor) throw this.exceptions.instructorNotFound;
    return instructor.courses;
  }

  async allCourseReviews(slug: string): Promise<Review[]> {
    const course = await this.courseRepo.findOne({
      where: { slug },
      relations: ['reviews.reviewCreator'],
    });
    if (!course) throw this.exceptions.courseNotFound;

    return course.reviews;
  }

  async findAll(type: string): Promise<Course[]> {
    if (type == 'frontend' || type == 'backend' || type == 'fullStack') {
      return await this.courseRepo.find({ where: { category: type } });
    } else if (!type) {
      return await this.courseRepo.find();
    }
    throw new HttpException('Invalid category type', HttpStatus.NOT_FOUND);
  }

  async findOne(slug: string): Promise<Course> {
    const course = await this.courseRepo.findOne({
      where: { slug },
      relations: ['reviews', 'courseCreator'],
    });
    if (!course) throw this.exceptions.courseNotFound;
    const ratingReviews = course.reviews;
    // const ratings = calculatePercentage(ratingReviews) || 0;
    // const ratingsPersentage = ratings.toString() + '%';
    return course;
  }

  async update(
    req: any,
    courseId: number,
    updateCourseDto: UpdateCourseDto,
    file: Express.Multer.File,
  ): Promise<Course> {
    const { id } = req.user;
    const instructor = await this.instructorRepo.findOneBy({ id });
    if (!instructor) throw this.exceptions.instructorNotFound;
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
    const course = await this.courseRepo.findOne({
      where: { id: courseId },
      relations: ['reviews'],
    });
    if (!course) throw this.exceptions.courseNotFound;
    const instructor = await this.instructorRepo.findOne({
      where: { id },
      relations: ['courses.reviews'],
    });
    if (!instructor) throw this.exceptions.instructorNotFound;
    await this.reviewRepo.remove(course.reviews);
    await this.courseRepo.remove(course);
    return 'Couese Removed';
  }

  async removeThumbnail(req: any, courseId: number) {
    const { id } = req.user;
    const instructor = await this.instructorRepo.findOneBy({ id });
    if (!instructor) throw this.exceptions.instructorNotFound;
    const course = await this.courseRepo.findOneBy({ id: courseId });
    if (!course) throw this.exceptions.courseNotFound;
    course.thumbnails = null;
    return await this.courseRepo.save(course);
  }
}
