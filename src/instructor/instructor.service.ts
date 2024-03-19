import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { UpdateInstructorDto } from './dto/update-instructor.dto';
import { Instructor } from './entities/instructor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from 'src/course/entities/course.entity';

@Injectable()
export class InstructorService {
  constructor(
    @InjectRepository(Instructor)
    private readonly instructorRepo: Repository<Instructor>,
  ) {}
  async create(createInstructorDto: CreateInstructorDto): Promise<Instructor> {
    const newInstructor = new Instructor();
    Object.assign(newInstructor, createInstructorDto);
    const instructor = await this.instructorRepo.save(newInstructor);
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
  ): Promise<Instructor> {
    const { id } = req.user;
    const instructor = await this.instructorRepo.findOneBy({ id });
    if (!instructor.isInstructor) {
      throw new HttpException('Not allowed', HttpStatus.METHOD_NOT_ALLOWED);
    }
    Object.assign(instructor, updateInstructorDto);
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
}
