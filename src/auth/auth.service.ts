import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { comparePasswords } from './bcrypt/bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import crypto from 'crypto';

import { User } from 'src/user/entities/user.entity';
import { Instructor } from 'src/instructor/entities/instructor.entity';
import { SignInDto } from './dto/signin.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { CreateInstructorDto } from 'src/instructor/dto/create-instructor.dto';
import { sendEmail } from 'src/utils/sendEmail';

@Injectable()
export class AuthService {
  cloudinarySrv: any;
  exceptions: any;
  // unauthorizedException: any;
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
    throw this.unauthorizedException;
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
    throw this.unauthorizedException;
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
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  async forgotPassword(req: any): Promise<{ status: string; message: string }> {
    const { email } = req.body;
    const user = await this.userRepo.findOneBy({ email });
    if (!user) throw this.unauthorizedException;

    // 2 ) if user exists, Generate random 6 digits (using js)
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedResetCode = crypto
      .createHash('sha256')
      .update(resetCode)
      .digest('hex');

    // 3 ) save hashed password reset code in db
    user.passwordResetCode = hashedResetCode;

    // 4 ) add expiration time to the password reset code (10 min)
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
    user.passwordResetVerified = false;

    // save do db
    await this.userRepo.save(user);

    const message = `Hi ${user.username},\n We received a request to reset the password on your E-learning Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The E-learning Team`;

    // 5 ) send the reset code via email
    try {
      await sendEmail({
        email: user.email,
        subject: 'Your password rese code - [valid for 10 min]',
        message,
      });
      return { status: 'Success', message: 'Reset code sent to email' };
    } catch (err) {
      user.passwordResetCode = undefined;
      user.passwordResetExpires = undefined;
      user.passwordResetVerified = undefined;

      await this.userRepo.save(user);
      throw new HttpException(
        'There is an error in sending email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async verifyPasswordResetCode(req: any): Promise<{ status: string }> {
    // 1 ) get user based on reset code, i need to hash if first
    const hashedResetCode = crypto
      .createHash('sha256')
      .update(req.body.resetCode)
      .digest('hex');

    const user = await this.userRepo.findOne({
      where: {
        passwordResetCode: hashedResetCode,
        passwordResetExpires: MoreThan(new Date()),
      },
    });
    if (!user) {
      throw new HttpException(
        'Reset code invalid or expired',
        HttpStatus.FORBIDDEN,
      );
    }

    // 2 ) check if the reset code is valid and make passwordResetVerified true
    user.passwordResetVerified = true;
    await this.userRepo.save(user);

    return { status: 'Success' };
  }

  async resetPassword(req: any): Promise<{ user: User; token: string }> {
    // 1) Get user based on email
    const user = await this.userRepo.findOne({
      where: { email: req.body.email },
    });
    if (!user) {
      throw new HttpException(
        `There is no user with this email ${req.body.email}`,
        HttpStatus.NOT_FOUND,
      );
    }

    // 2) Check if reset code verified
    if (!user.passwordResetVerified) {
      throw new HttpException(
        'Reset code not verified',
        HttpStatus.BAD_REQUEST,
      );
    }

    // 3) If all processes are valid, change the password
    user.password = req.body.newPassword;
    user.passwordChangedAt = new Date();
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await this.userRepo.save(user);

    // 4) After changing password, return new token
    const payload = { id: user.id };
    const token = await this.jwtService.signAsync(payload, { expiresIn: '3d' });

    return { user, token };
  }

  unauthorizedException = new HttpException(
    'username or password is wrong',
    HttpStatus.METHOD_NOT_ALLOWED,
  );
}
