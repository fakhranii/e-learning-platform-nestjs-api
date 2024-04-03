import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { UpdateInstructorDto } from './dto/update-instructor.dto';
import { Instructor } from './entities/instructor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class InstructorService {
  constructor(
    @InjectRepository(Instructor)
    private readonly instructorRepo: Repository<Instructor>,
    private readonly cloudinarySrv: CloudinaryService,
  ) {}
  async create(
    createInstructorDto: CreateInstructorDto,
    file: Express.Multer.File,
  ): Promise<Instructor | string> {
    const existingInstructor = await this.instructorRepo.findOne({
      where: { email: createInstructorDto.email },
    });
    if (existingInstructor) {
      return 'Instructor already exists';
    }
    const instructor = new Instructor();
    Object.assign(instructor, createInstructorDto);
    instructor.avatar = (await this.cloudinarySrv.uploadFile(file)).secure_url;
    await this.instructorRepo.save(instructor);
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
