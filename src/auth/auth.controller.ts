import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { SignInDto } from './dto/signin.dto';

@Controller('v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @HttpCode(HttpStatus.OK)
  @Post('user/signin')
  userSignIn(@Body() signInDto: SignInDto) {
    return this.authService.userSignIn(signInDto);
  }

  @Post('instructor/signin')
  instructorSignIn(@Body() signInDto: SignInDto) {
    return this.authService.instructorSignIn(signInDto);
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
