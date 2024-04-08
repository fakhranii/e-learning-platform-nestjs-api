import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Exceptions } from 'src/common/Exceptions';

@Injectable()
export class UserService {
  constructor(
    private readonly cloudinarySrv: CloudinaryService,
    private readonly exceptions: Exceptions,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async create(
    createUserDto: CreateUserDto,
    file: Express.Multer.File,
  ): Promise<User> {
    const existingUser = await this.userRepo.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) throw new Error('User already exists');

    const user = new User();
    Object.assign(user, createUserDto);
    if (file) {
      user.avatar = (await this.cloudinarySrv.uploadFile(file)).secure_url;
    }
    await this.userRepo.save(user);
    delete user.password;
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userRepo.find(); // find all
  }

  async findOne(req: any): Promise<User> {
    const { id } = req.user;
    const user = this.userRepo.findOne({
      where: { id },
      relations: ['courses', 'reviews'],
    });
    if (!user) throw this.exceptions.userNotFound;
    return user;
  }

  async update(
    req: any,
    updateUserDto: UpdateUserDto,
    file: Express.Multer.File,
  ): Promise<User> {
    const { id } = req.user;
    const user = await this.userRepo.findOneBy({ id });
    if (!user) throw this.exceptions.userNotFound;
    Object.assign(user, updateUserDto); //  target , source
    if (file) {
      user.avatar = (await this.cloudinarySrv.uploadFile(file)).secure_url;
    }
    return await this.userRepo.save(user);
  }

  async remove(req: any) {
    const { id } = req.user;
    const user = await this.userRepo.findOneBy({ id });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return this.userRepo.delete(id);
  }

  async removeAvatar(req: any) {
    const { id } = req.user;
    const user = await this.userRepo.findOneBy({ id });
    if (!user) throw this.exceptions.userNotFound;
    user.avatar = null;
    return await this.userRepo.save(user);
  }
}
