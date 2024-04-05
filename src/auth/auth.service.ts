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
  ): Promise<{ user: User; token: string }> {
    const user = await this.userRepo.findOne({
      where: { username: signInDto.username },
      select: [
        'password',
        'username',
        'email',
        'isAdmin',
        'id',
        'avatar',
        'fullName',
        'createdAt',
      ],
    });
    if (user) {
      const matched = comparePasswords(signInDto.password, user?.password);
      delete user.password;
      if (matched) {
        const payload = {
          id: user.id,
          isAdmin: user.isAdmin,
        }; // key : valu
        return {
          user,
          token: await this.jwtService.signAsync(payload, { expiresIn: '1h' }),
        };
      }
    }
    throw new HttpException(
      'Invalid username or password',
      HttpStatus.UNAUTHORIZED,
    );
  }

  async instructorSignIn(
    signInDto: SignInDto,
  ): Promise<{ user: Instructor; token: string }> {
    const instructor = await this.instructorRepo.findOne({
      where: { username: signInDto.username },
      select: [
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
    if (instructor) {
      const matched = comparePasswords(signInDto.password, instructor.password);
      delete instructor.password;
      if (matched) {
        const payload = {
          isInstructor: instructor.isInstructor,
          id: instructor.id,
        };
        return {
          user: instructor,
          token: await this.jwtService.signAsync(payload),
        };
      }
    }
    throw new HttpException(
      'Invalid username or password',
      HttpStatus.UNAUTHORIZED,
    );
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
}
