import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/user/entities/user.entity';
import { Instructor } from 'src/instructor/entities/instructor.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { Exceptions } from '../utils/Exceptions';

@Module({
  imports: [
    CloudinaryModule,
    TypeOrmModule.forFeature([User, Instructor]), // db repos
    UserModule,
    JwtModule.register({
      global: true,
      secret: process.env.jwtSecret,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, Exceptions],
})
export class AuthModule {}
