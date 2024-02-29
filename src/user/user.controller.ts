import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
 * @desc   create new user
 * @route  /v1/user
 * @method POST
 * @access public
 */
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  /**
 * @desc   get all courses of current user
 * @route  /v1/user/courses/:id
 * @method GET
 * @access private
 */
  @UseGuards(AuthGuard)
  @Get("courses/:id")
  findAllUserCourses(@Param('id') id: string) {
    return this.userService.findAllUserCourses(+id);
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
  @UseGuards(AuthGuard)
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
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  /**
   * @desc   delete user by id
   * @route  /v1/user/:id
   * @method DELETE
   * @access private
   */
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
