import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor( 
    // oop - first thing run in the file
    @InjectRepository(User) private readonly userRepo: Repository<User> 
  ){}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    Object.assign(user, createUserDto) // target , source
    return await this.userRepo.save(user);

  }

  async findAll(): Promise<User[]> {
    return this.userRepo.find(); // find all 
  }

  async findOne(id: number):Promise<User> {
    // return this.userRepo.findOne();
    return this.userRepo.findOneBy({id});
  }

  async update(id: number, updateUserDto: UpdateUserDto) :Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    return await this.userRepo.save(user)
  }

  remove(id: number) {
    return this.userRepo.delete(id);
  }
}
