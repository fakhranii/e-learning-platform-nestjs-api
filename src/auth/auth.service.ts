import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { comparePasswords } from './bcrypt/bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Instructor } from 'src/instructor/entities/instructor.entity';

@Injectable()
export class AuthService {
  constructor(
    private userSrv: UserService,
    private jwtService: JwtService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Instructor)
    private readonly instructorRepo: Repository<Instructor>,
  ) {}

  async userSignIn(
    username: string,
    password: string,
  ): Promise<{ user: User; token: string }> {
    const user = await this.userRepo.findOne({
      where: { username },
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
    const matched = comparePasswords(password, user.password);
    delete user.password;
    if (matched) {
      const payload = { id: user.id, username: user.username }; // key : value
      return {
        user,
        token: await this.jwtService.signAsync(payload),
      };
    }
  }

  async instructorSignIn(
    username: string,
    password: string,
  ): Promise<{ instructor: Instructor; token: string }> {
    const instructor = await this.instructorRepo.findOne({
      where: { username },
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
    const matched = comparePasswords(password, instructor.password);
    delete instructor.password;
    if (matched) {
      const payload = { id: instructor.id, username: instructor.username };
      return {
        instructor,
        token: await this.jwtService.signAsync(payload),
      };
    }
  }
}
