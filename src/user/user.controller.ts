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
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('v1/users') //? our request url
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * @desc   create new user
   * @route  /v1/user
   * @method POST
   * @access public
   */
  @Post() //? POST v1/user/
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Post('enroll/:slug')
  enrollCourse(@Request() req, @Param('slug') slug: string) {
    return this.userService.enrollCourse(req, slug);
  }

  @UseGuards(AuthGuard)
  @Delete('unenroll/:slug')
  unEnrollCourse(@Request() req, @Param('slug') slug: string) {
    return this.userService.unEnrollCourse(req, slug);
  }

  /**
   * @desc   get all users
   * @route  /v1/user/
   * @method GET
   * @access public
   */
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  /**
   * @desc   get user by id
   * @route  /v1/user/:id
   * @method GET
   * @access private
   */
  // @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  /**
   * @desc   update user by id
   * @route  /v1/user/:id
   * @method PATCH
   * @access private
   */
  @UseGuards(AuthGuard)
  @Patch()
  update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(req, updateUserDto);
  }

  /**
   * @desc   delete user by id
   * @route  /v1/user/:id
   * @method DELETE
   * @access private
   */
  @UseGuards(AuthGuard)
  @Delete()
  remove(@Request() req) {
    return this.userService.remove(req);
  }
}
