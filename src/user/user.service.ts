import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
<<<<<<< HEAD
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
=======
import {
  HttpException,
  HttpStatus,
  Injectable,
  UseGuards,
} from '@nestjs/common';
>>>>>>> 65018de (init)
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Course } from 'src/course/entities/course.entity';
import { Instructor } from 'src/instructor/entities/instructor.entity';
<<<<<<< HEAD
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import * as request from 'supertest';
import { Request } from 'express';
=======
>>>>>>> 65018de (init)

@Injectable()
export class UserService {
  constructor(
<<<<<<< HEAD
    private readonly cloudinarySrv: CloudinaryService,
=======
    // oop - first thing run in the file
>>>>>>> 65018de (init)
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Course) private readonly courseRepo: Repository<Course>,
    @InjectRepository(Instructor)
    private readonly instructorRepo: Repository<Instructor>,
  ) {}

<<<<<<< HEAD
  async create(
    createUserDto: CreateUserDto,
    file: Express.Multer.File,
  ): Promise<User> {
    const existingUser = await this.userRepo.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const user = new User();
    Object.assign(user, createUserDto);
    user.avatar = (await this.cloudinarySrv.uploadFile(file)).secure_url;
=======
  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    Object.assign(user, createUserDto);
>>>>>>> 65018de (init)
    await this.userRepo.save(user);
    delete user.password;
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userRepo.find(); // find all
  }

  async findOne(id: number): Promise<User> {
    return this.userRepo.findOne({ where: { id }, relations: ['courses'] });
  }

<<<<<<< HEAD
  async update(
    req: any,
    updateUserDto: UpdateUserDto,
    file: Express.Multer.File,
  ): Promise<User> {
=======
  async update(req: any, updateUserDto: UpdateUserDto): Promise<User> {
>>>>>>> 65018de (init)
    const { id } = req.user;
    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      throw new HttpException('Not allowed', HttpStatus.METHOD_NOT_ALLOWED);
    }
    Object.assign(user, updateUserDto); //  target , source
<<<<<<< HEAD
    if (file) {
      user.avatar = (await this.cloudinarySrv.uploadFile(file)).secure_url;
    }
=======
>>>>>>> 65018de (init)
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
<<<<<<< HEAD

  async removeAvatar(req: any) {
    const { id } = req.user;
    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      throw new HttpException('Not allowed', HttpStatus.METHOD_NOT_ALLOWED);
    }
    user.avatar = null;
    return await this.userRepo.save(user);
  }
=======
>>>>>>> 65018de (init)
}
