import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Course } from 'src/course/entities/course.entity';
import { Instructor } from 'src/instructor/entities/instructor.entity';
import { Review } from 'src/review/entities/review.entity';
import { User } from 'src/user/entities/user.entity';
import { Exceptions } from 'src/utils/Exceptions';
import { InstructorController } from '../instructor/instructor.controller';

@Injectable()
export class AdminDashboardService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Review) private readonly reviewRepo: Repository<Review>,
    @InjectRepository(Course) private readonly courseRepo: Repository<Course>,
    @InjectRepository(Instructor)
    private readonly instructorRepo: Repository<Instructor>,
    private readonly exceptions: Exceptions,
  ) {}

  async findAllActiveUsers(): Promise<{
    data: User[];
    activeUserCount: number;
  }> {
    const users = await this.userRepo.find({ where: { active: true } });
    const userCount = users.length;
    return { activeUserCount: userCount, data: users };
  }

  async findAllInactiveUsers(): Promise<{
    data: User[];
    inactiveUserCount: number;
  }> {
    const users = await this.userRepo.find({ where: { active: false } });
    const userCount = users.length;
    return { inactiveUserCount: userCount, data: users };
  }

  async findAllInactiveInstructors(): Promise<{
    data: Instructor[];
    inactiveInstructorsCount: number;
  }> {
    const instructors = await this.instructorRepo.find({
      where: { active: false },
    });
    const inactiveInstructorsCount = instructors.length;
    return {
      inactiveInstructorsCount,
      data: instructors,
    };
  }

  async findAllactiveInstructors(): Promise<{
    data: Instructor[];
    activeInstructorsCount: number;
  }> {
    const instructors = await this.instructorRepo.find({
      where: { active: true },
    });
    const activeInstructorsCount = instructors.length;
    return {
      activeInstructorsCount,
      data: instructors,
    };
  }

  async deactiveUser(id: number) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) throw this.exceptions.userNotFound;
    user.active = false;
    await this.userRepo.save(user);
    return `user ${user.fullName} deactivated successfully ✔`;
  }

  async activeUser(id: number) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) throw this.exceptions.userNotFound;
    user.active = true;
    await this.userRepo.save(user);
    return `user ${user.fullName} activated successfully ✔`;
  }

  async deactiveInstructor(id: number) {
    const instructor = await this.instructorRepo.findOneBy({
      id,
      // relations: ['courses.reviews.reviewCreator'],
      // withDeleted: true,
    });
    if (!instructor) throw this.exceptions.instructorNotFound;
    // const course = await this.courseRepo.find({
    //   where: { courseCreator: instructor },
    //   relations: ['courseCreator'],
    // });
    // console.log(instructor.courses);
    // if (!course) throw this.exceptions.courseNotFound;

    // await this.courseRepo.remove(instructor.courses);
    instructor.active = false;
    await this.instructorRepo.save(instructor);
    return `Instructor ${instructor.fullName} deactivated successfully ✔`;
  }

  async activeInstructor(id: number) {
    const instructor = await this.instructorRepo.findOneBy({
      id,
      // relations: ['courses.reviews.reviewCreator'],
      // withDeleted: true,
    });
    if (!instructor) throw this.exceptions.instructorNotFound;
    // const course = await this.courseRepo.find({
    //   where: { courseCreator: instructor },
    //   relations: ['courseCreator'],
    // });
    // console.log(instructor.courses);
    // if (!course) throw this.exceptions.courseNotFound;

    // await this.courseRepo.remove(instructor.courses);
    instructor.active = true;
    await this.instructorRepo.save(instructor);
    return `Instructor ${instructor.fullName} activated successfully ✔`;
  }

  async removeCourse(id: number) {
    const course = await this.courseRepo.findOne({
      where: { id },
      relations: ['reviews'],
    });
    if (!course) throw this.exceptions.courseNotFound;
    await this.reviewRepo.remove(course.reviews);
    return await this.courseRepo.remove(course);
  }

  async removeReview(id: number) {
    const reviw = await this.reviewRepo.findOneBy({ id });
    const course = reviw.course;
    course.numberOfRatings--;
    return await this.reviewRepo.delete(id);
  }
}
