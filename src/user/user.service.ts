import { Injectable, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Course } from 'src/course/entities/course.entity';

@Injectable()
export class UserService {
  constructor( 
    // oop - first thing run in the file
    @InjectRepository(Course) private readonly courseRepo: Repository<Course>,
    @InjectRepository(User) private readonly userRepo: Repository<User> 
  ){}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    Object.assign(user, createUserDto) // target , source
    await this.userRepo.save(user);
    delete user.password;
    return user;
  }

  // @UseGuards(AuthGuard) // should have token to pass
  async findAll(): Promise<User[]> {
    return this.userRepo.find(); // find all 
  }

  async findAllUserCourses(id: number): Promise<Course[]>{
    const user = await this.findOne(id);
   return await this.courseRepo.find({where: {user: user.courses}})
  }
  
  async findOneByUsername(username): Promise<User>{
    return this.userRepo.findOneBy({username});
  }
  
  async findOne(id: number):Promise<User> {
    return this.userRepo.findOneBy({id});
  }
  
  // @UseGuards(AuthGuard) // should have token to pass
  async update(id: number, updateUserDto: UpdateUserDto) :Promise<User> {
    const user = await this.findOne(id); 
    Object.assign(user, updateUserDto); //  target , source 
    return await this.userRepo.save(user)
  }

  remove(id: number) {
    return this.userRepo.delete(id);
  }
}
