import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { comparePasswords } from './bcrypt/bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/user/entities/user.entity';
import { Instructor } from 'src/instructor/entities/instructor.entity';
import { SignInDto } from './dto/signin.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { CreateInstructorDto } from 'src/instructor/dto/create-instructor.dto';

@Injectable()
export class AuthService {
  cloudinarySrv: any;
  exceptions: any;
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Instructor)
    private readonly instructorRepo: Repository<Instructor>,
  ) {}

  async userSignup(
    createUserDto: CreateUserDto,
    file: Express.Multer.File,
  ): Promise<{ user: User; token: string }> {
    const existingUser = await this.userRepo.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser)
      throw new HttpException(
        'User already exists, Try new one',
        HttpStatus.METHOD_NOT_ALLOWED,
      );

    const user = new User();
    Object.assign(user, createUserDto);
    if (file)
      user.avatar = (await this.cloudinarySrv.uploadFile(file)).secure_url;

    await this.userRepo.save(user);
    delete user.password;
    // return user;
    const payload = {
      id: user.id,
      isAdmin: user.isAdmin,
    }; // key : valu

    return {
      user,
      token: await this.jwtService.signAsync(payload, {
        expiresIn: '3d',
      }),
    };
  }

  async userSignIn(
    signInDto: SignInDto,
    rememberMe: string,
  ): Promise<{ user: User; token: string }> {
    const user = await this.userRepo.findOne({
      where: { username: signInDto.username },
      select: [
        'password',
        'email',
        'username',
        'email',
        'isAdmin',
        'id',
        'avatar',
        'fullName',
        'createdAt',
      ],
    });

    if (!user) throw this.unauthorizedException;
    const matched = comparePasswords(signInDto.password, user.password);
    if (!matched) throw this.unauthorizedException;
    delete user.password;
    if (matched) {
      const payload = {
        id: user.id,
        isAdmin: user.isAdmin,
      }; // key : valu

      if (rememberMe === 'true') {
        return {
          user,
          token: await this.jwtService.signAsync(payload, {
            expiresIn: '7d',
          }),
        };
      } else if (rememberMe === 'false' || rememberMe === null) {
        return {
          user,
          token: await this.jwtService.signAsync(payload, {
            expiresIn: '3d',
          }),
        };
      } else {
        throw new HttpException('Invalid query', HttpStatus.NOT_ACCEPTABLE);
      }
    }
  }

  async instructorSignup(
    createInstructorDto: CreateInstructorDto,
    file: Express.Multer.File,
  ): Promise<{ instructor: Instructor; token: string }> {
    const existingInstructor = await this.instructorRepo.findOne({
      where: { email: createInstructorDto.email },
    });
    if (existingInstructor) throw this.exceptions.instructorAlreadyExists;
    const instructor = new Instructor();
    Object.assign(instructor, createInstructorDto);
    if (file) {
      instructor.avatar = (
        await this.cloudinarySrv.uploadFile(file)
      ).secure_url;
    }
    await this.instructorRepo.save(instructor);
    delete instructor.password;
    // return instructor;
    const payload = {
      id: instructor.id,
      isInstructor: instructor.isInstructor,
    };
    return {
      instructor,
      token: await this.jwtService.signAsync(payload, {
        expiresIn: '3d',
      }),
    };
  }

  async instructorSignIn(
    signInDto: SignInDto,
    rememberMe: string,
  ): Promise<{ user: Instructor; token: string }> {
    const instructor = await this.instructorRepo.findOne({
      where: { username: signInDto.username },
      select: [
        'id',
        'email',
        'username',
        'password',
        'isInstructor',
        'coursesCount',
        'fullName',
        'studentsCount',
        'avatar',
        'ratingsCount',
        'instructorDescription',
        'createdAt',
      ],
    });

    if (!instructor) throw this.unauthorizedException;
    const matched = comparePasswords(signInDto.password, instructor.password);
    if (!matched) throw this.unauthorizedException;
    delete instructor.password;
    if (matched) {
      const payload = {
        id: instructor.id,
        isInstructor: instructor.isInstructor,
      };
      if (rememberMe === 'true') {
        return {
          user: instructor,
          token: await this.jwtService.signAsync(payload, {
            expiresIn: '7d',
          }),
        };
      } else if (rememberMe === 'false') {
        return {
          user: instructor,
          token: await this.jwtService.signAsync(payload, {
            expiresIn: '3d',
          }),
        };
      } else {
        throw new HttpException('Invalid query', HttpStatus.NOT_ACCEPTABLE);
      }
    }
  }

  async currentUser(req: any): Promise<{ user: User | Instructor }> {
    const { id, isInstructor, isAdmin } = req.user;
    if (isInstructor) {
      const instructor = await this.instructorRepo.findOneBy({ id });
      return {
        user: instructor,
      };
    } else if (isAdmin === false) {
      const user = await this.userRepo.findOneBy({ id });
      return { user: user };
    } else if (isAdmin === true) {
      const user = await this.userRepo.findOneBy({ id });
      return { user: user };
    }
  }
  

  unauthorizedException = new HttpException(
    'username or password is wrong',
    HttpStatus.METHOD_NOT_ALLOWED,
  );
}
