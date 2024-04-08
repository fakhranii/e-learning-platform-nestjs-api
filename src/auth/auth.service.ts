import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { comparePasswords } from './bcrypt/bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Instructor } from 'src/instructor/entities/instructor.entity';
import { SignInDto } from './dto/signin.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Instructor)
    private readonly instructorRepo: Repository<Instructor>,
  ) {}

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
    const matched = comparePasswords(signInDto.password, user?.password);
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
