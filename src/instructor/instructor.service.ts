import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { UpdateInstructorDto } from './dto/update-instructor.dto';
import { Instructor } from './entities/instructor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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

  async findAll(): Promise<Instructor[]> {
    return await this.instructorRepo.find();
  }

  async findOne(id: number): Promise<Instructor> {
    return await this.instructorRepo.findOneBy({ id });
  }

  async update(
    id: number,
    updateInstructorDto: UpdateInstructorDto,
  ): Promise<Instructor> {
    const instructor = await this.instructorRepo.findOneBy({ id });
    Object.assign(instructor, updateInstructorDto);
    return await this.instructorRepo.save(instructor);
  }

  async remove(id: number) {
    const result = await this.instructorRepo.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException(`instructor with ID ${id} not found`);
    }
    return `instructor is removed`;
  }
}
