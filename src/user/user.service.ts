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

  async findUserCorses(req: any): Promise<any> {
    const { id } = req.user;
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['courses.reviews.reviewCreator'],
    });
    if (!user) throw this.exceptions.userNotFound;
    const coursesWithReviews = user.courses.map((course) => {
      let hasReviewed = false;
      for (const review of course.reviews) {
        const reviewCreatorId = review.reviewCreator.id;
        if (user.id === reviewCreatorId) {
          hasReviewed = true;
          break;
        }
      }
      return {
        ...course,
        hasReviewed,
      };
    });

    return coursesWithReviews;
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
