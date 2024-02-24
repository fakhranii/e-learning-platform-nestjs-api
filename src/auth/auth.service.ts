import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { comparePasswords } from './bcrypt/bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userSrv: UserService,
    private jwtService: JwtService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async signIn(
    username: string,
    password: string,
    // ): Promise<{ access_token: string }> {
  ): Promise<any> {
    // const user = await this.userSrv.findOneByUsername(username); // object without password
    const user = await this.userRepo.findOne({
      where: { username },
      select: ['password','username', 'email', 'isAdmin', 'id'],
    });
    console.log(user); // print

    const matched = comparePasswords(password, user.password);
    if (matched) {
      // throw new UnauthorizedException();
      const payload = { id: user.id, username: user.username }; // key : value
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    }
  }
}
