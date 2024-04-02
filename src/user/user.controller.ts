import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
<<<<<<< HEAD
  UseInterceptors,
  UploadedFile,
=======
>>>>>>> 65018de (init)
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
<<<<<<< HEAD
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Controller('v1/users') //? our request url
export class UserController {
  constructor(
    private readonly userSrv: UserService,
    private readonly cloudinarySrv: CloudinaryService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.userSrv.create(createUserDto, file);
=======

@Controller('v1/users') //? our request url
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post() //? POST v1/user/
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
>>>>>>> 65018de (init)
  }

  @Get()
  findAll() {
<<<<<<< HEAD
    return this.userSrv.findAll();
=======
    return this.userService.findAll();
>>>>>>> 65018de (init)
  }
  // @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
<<<<<<< HEAD
    return this.userSrv.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Patch()
  update(
    @Request() req,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userSrv.update(req, updateUserDto, file);
=======
    return this.userService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Patch()
  update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(req, updateUserDto);
>>>>>>> 65018de (init)
  }

  @UseGuards(AuthGuard)
  @Delete()
  remove(@Request() req) {
<<<<<<< HEAD
    return this.userSrv.remove(req);
  }

  @UseGuards(AuthGuard)
  @Delete('/avatar')
  removeAvatar(@Request() req) {
    return this.userSrv.removeAvatar(req);
=======
    return this.userService.remove(req);
>>>>>>> 65018de (init)
  }
}
