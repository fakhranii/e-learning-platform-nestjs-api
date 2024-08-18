import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
``
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Exceptions } from '../utils/Exceptions';
import { Course } from 'src/course/entities/course.entity';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { UpdateInstructorDto } from './dto/update-instructor.dto';
import { Instructor } from './entities/instructor.entity';

@Injectable()
export class InstructorService {
  constructor(
    @InjectRepository(Instructor)
    private readonly instructorRepo: Repository<Instructor>,
    @InjectRepository(Course) readonly courseRepo: Repository<Course>,
    private readonly cloudinarySrv: CloudinaryService,
    private readonly exceptions: Exceptions,
  ) {}
  async create(
    createInstructorDto: CreateInstructorDto,
    file: Express.Multer.File,
  ): Promise<Instructor> {
    const existingInstructor = await this.instructorRepo.findOne({
      where: { email: createInstructorDto.email },
    });
    if (existingInstructor) throw this.exceptions.instructorAlreadyExists;
    const instructor = new Instructor();
    Object.assign(instructor, createInstructorDto);
    if (file) {
      instructor.avatar = (
        await this.cloudinarySrv.uploadFile(file)
      ).secure_url;
    }
    await this.instructorRepo.save(instructor);
    delete instructor.password;
    return instructor;
  }

  async findAll(): Promise<Instructor[]> {
    return await this.instructorRepo.find();
  }

  async findOne(username: string): Promise<Instructor> {
    const instructor = await this.instructorRepo.findOne({
      where: { username },
      relations: ['courses.reviews.reviewCreator'],
    });
    if (!instructor) throw this.exceptions.instructorNotFound;
    return instructor;
  }

  async update(
    req: any,
    updateInstructorDto: UpdateInstructorDto,
    file: Express.Multer.File,
  ): Promise<Instructor> {
    const { id } = req.user;
    const instructor = await this.instructorRepo.findOneBy({ id });
    if (!instructor) throw this.exceptions.instructorNotFound;
    Object.assign(instructor, updateInstructorDto);
    if (file) {
      instructor.avatar = (
        await this.cloudinarySrv.uploadFile(file)
      ).secure_url;
    }
    return await this.instructorRepo.save(instructor);
  }

  async remove(req: any) {
    const { id } = req.user;
    const instructor = await this.instructorRepo.findOne({
      where: { id },
      relations: ['courses.reviews.reviewCreator'],
      withDeleted: true,
    });
    if (!instructor) throw this.exceptions.instructorNotFound;
    const course = await this.courseRepo.find({
      where: { courseCreator: instructor },
      relations: ['courseCreator'],
    });
    console.log(instructor.courses);
    if (!course) throw this.exceptions.courseNotFound;

    await this.courseRepo.remove(instructor.courses);
    return await this.instructorRepo.remove(instructor);
  }

  async removeAvatar(req: any) {
    const { id } = req.user;
    const instructor = await this.instructorRepo.findOneBy({ id });
    if (!instructor) throw this.exceptions.instructorNotFound;
    instructor.avatar = null;
    return await this.instructorRepo.save(instructor);
  }
}
