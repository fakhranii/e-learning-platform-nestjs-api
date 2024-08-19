import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Controller('v1/users/') //? our request url
export class UserController {
  constructor(
    private readonly userSrv: UserService,
    private readonly cloudinarySrv: CloudinaryService,
  ) {}

  // @Post() // v1/users -> Post method
  // @UseInterceptors(FileInterceptor('file'))
  // create(
  //   @UploadedFile() file: Express.Multer.File,
  //   @Body() createUserDto: CreateUserDto,
  // ) {
  //   return this.userSrv.create(createUserDto, file);
  // }

  @Get() // Get v1/users -> get method
  findAll() {
    return this.userSrv.findAll();
  }

  @UseGuards(AuthGuard) // protected route
  @Get('courses') // v1/users/courses
  findOne(@Request() req) {
    return this.userSrv.findUserCorses(req);
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Patch() //Patch v1/users
  update(
    @Request() req, // i can get the user Then i update it
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userSrv.update(req, updateUserDto, file);
  }

  @UseGuards(AuthGuard)
  @Delete()
  remove(@Request() req) {
    return this.userSrv.remove(req);
  }

  @UseGuards(AuthGuard)
  @Delete('/avatar')
  removeAvatar(@Request() req) {
    return this.userSrv.removeAvatar(req);
  }
}
