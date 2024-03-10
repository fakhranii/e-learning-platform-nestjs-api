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
  ): Promise<{ access_token: string }> {
    const user = await this.userRepo.findOne({
      where: { username },
      select: ['password', 'username', 'email', 'isAdmin', 'id'],
    });
    const matched = comparePasswords(password, user.password);
    if (matched) {
      const payload = { id: user.id, username: user.username }; // key : value
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    }
  }

  async instructorSignIn(
    username: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const instructor = await this.instructorRepo.findOneBy({ username });
    const payload = { id: instructor.id, username: instructor.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
