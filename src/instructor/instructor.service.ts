import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { UpdateInstructorDto } from './dto/update-instructor.dto';
import { Instructor } from './entities/instructor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Exceptions } from '../common/Exceptions';

@Injectable()
export class InstructorService {
  constructor(
    @InjectRepository(Instructor)
    private readonly instructorRepo: Repository<Instructor>,
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
    if (existingInstructor) {
      throw new Error('Instructor already exist');
    }
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
    console.log(username);
    const instructor = await this.instructorRepo.findOne({
      where: { username },
      relations: ['courses'],
    });
    if (!instructor.isInstructor) throw this.exceptions.instructorNotFound;
    return instructor;
  }

  async update(
    req: any,
    updateInstructorDto: UpdateInstructorDto,
    file: Express.Multer.File,
  ): Promise<Instructor> {
    const { id } = req.user;
    const instructor = await this.instructorRepo.findOneBy({ id });
    if (!instructor.isInstructor) throw this.exceptions.instructorNotFound;
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
    const instructor = await this.instructorRepo.findOneBy({ id });
    if (!instructor.isInstructor) throw this.exceptions.instructorNotFound;
    return await this.instructorRepo.delete(id);
  }

  async removeAvatar(req: any) {
    const { id } = req.user;
    const instructor = await this.instructorRepo.findOneBy({ id });
    if (!instructor.isInstructor) throw this.exceptions.instructorNotFound;
    instructor.avatar = null;
    return await this.instructorRepo.save(instructor);
  }
}
