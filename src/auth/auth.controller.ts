import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInUserDto } from './dto/signin-user.dto';
import { SignInInstructorDto } from 'src/auth/dto/signin-instructor.dto';
import { AuthGuard } from './guards/auth.guard';

@Controller('v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('user/signin')
  userSignIn(@Body() signInUserDto: SignInUserDto) {
    return this.authService.userSignIn(
      signInUserDto.username,
      signInUserDto.password,
    );
  }

  @Post('instructor/signin')
  instructorSignIn(@Body() signInInstructorDto: SignInInstructorDto) {
    return this.authService.instructorSignIn(
      signInInstructorDto.username,
      signInInstructorDto.password,
    );
  }

  @UseGuards(AuthGuard)
  @Get('user/profile')
  getUserProfile(@Request() req) {
    return this.authService.currentUser(req);
  }

}
