import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { SignInDto } from './dto/signin.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { CreateInstructorDto } from 'src/instructor/dto/create-instructor.dto';

@Controller('v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('user/signup') // v1/users -> Post method
  @UseInterceptors(FileInterceptor('file'))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.authService.userSignup(createUserDto, file);
  }

  @Post('user/signin')
  userSignIn(
    @Body() signInDto: SignInDto,
    @Query('rememberMe') rememberMe: string,
  ) {
    return this.authService.userSignIn(signInDto, rememberMe);
  }

  @Post('instructor/signup')
  @UseInterceptors(FileInterceptor('file'))
  instructorSignup(
    @Body() createInstructorDto: CreateInstructorDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.authService.instructorSignup(createInstructorDto, file);
  }

  @Post('instructor/signin')
  instructorSignIn(
    @Body() signInDto: SignInDto,
    @Query('rememberMe') rememberMe: string,
  ) {
    return this.authService.instructorSignIn(signInDto, rememberMe);
  }

  @UseGuards(AuthGuard)
  @Get('user/profile')
  getUserProfile(@Request() req) {
    return this.authService.currentUser(req);
  }

  @UseGuards(AuthGuard)
  @Delete('user/signout')
  userSignOut(@Request() req) {
    const token = req.headers.authorization.replaceAll(
      req.headers.authorization,
      'it became a invalid token',
    );
    return { message: 'Signout successful', token };
  }


  
}
