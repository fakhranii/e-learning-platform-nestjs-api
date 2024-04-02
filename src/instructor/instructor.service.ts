<<<<<<< HEAD
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
=======
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
>>>>>>> 65018de (init)
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { UpdateInstructorDto } from './dto/update-instructor.dto';
import { Instructor } from './entities/instructor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
<<<<<<< HEAD
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
=======
import { Course } from 'src/course/entities/course.entity';
>>>>>>> 65018de (init)

@Injectable()
export class InstructorService {
  constructor(
    @InjectRepository(Instructor)
    private readonly instructorRepo: Repository<Instructor>,
<<<<<<< HEAD
    private readonly cloudinarySrv: CloudinaryService,
  ) {}
  async create(
    createInstructorDto: CreateInstructorDto,
    file: Express.Multer.File,
  ): Promise<Instructor> {
    const existingInstructor = await this.instructorRepo.findOne({
      where: { email: createInstructorDto.email },
    });
    if (existingInstructor) {
      throw new Error('Instructor already exists');
    }
    const instructor = new Instructor();
    Object.assign(instructor, createInstructorDto);
    instructor.avatar = (await this.cloudinarySrv.uploadFile(file)).secure_url;
    await this.instructorRepo.save(instructor);
=======
  ) {}
  async create(createInstructorDto: CreateInstructorDto): Promise<Instructor> {
    const newInstructor = new Instructor();
    Object.assign(newInstructor, createInstructorDto);
    const instructor = await this.instructorRepo.save(newInstructor);
>>>>>>> 65018de (init)
    delete instructor.password;
    return instructor;
  }

  async findAllInstructorCourses(req: any): Promise<Instructor> {
    const { id } = req.user;
    return await this.instructorRepo.findOne({
      where: { id },
      relations: ['courses'],
    });
  }

  async findAll(): Promise<Instructor[]> {
    return await this.instructorRepo.find();
  }

  async findOne(id: number): Promise<Instructor> {
    return await this.instructorRepo.findOne({
      where: { id },
      relations: ['courses'],
    });
  }

  async update(
    req: any,
    updateInstructorDto: UpdateInstructorDto,
<<<<<<< HEAD
    file: Express.Multer.File,
=======
>>>>>>> 65018de (init)
  ): Promise<Instructor> {
    const { id } = req.user;
    const instructor = await this.instructorRepo.findOneBy({ id });
    if (!instructor.isInstructor) {
      throw new HttpException('Not allowed', HttpStatus.METHOD_NOT_ALLOWED);
    }
    Object.assign(instructor, updateInstructorDto);
<<<<<<< HEAD
    if (file) {
      instructor.avatar = (
        await this.cloudinarySrv.uploadFile(file)
      ).secure_url;
    }
=======
>>>>>>> 65018de (init)
    return await this.instructorRepo.save(instructor);
  }

  async remove(req: any) {
    const { id } = req.user;
    const instructor = await this.instructorRepo.findOneBy({ id });
    if (!instructor.isInstructor) {
      throw new HttpException('Not allowed', HttpStatus.METHOD_NOT_ALLOWED);
    }
    return await this.instructorRepo.delete(id);
  }
<<<<<<< HEAD

  async removeAvatar(req: any) {
    const { id } = req.user;
    const instructor = await this.instructorRepo.findOneBy({ id });
    if (!instructor.isInstructor) {
      throw new HttpException('Not allowed', HttpStatus.METHOD_NOT_ALLOWED);
    }
    instructor.avatar = null;
    return await this.instructorRepo.save(instructor);
  }
=======
>>>>>>> 65018de (init)
}
