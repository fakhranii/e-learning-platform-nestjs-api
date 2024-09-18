import { Controller, Get, Delete, Param, Post } from '@nestjs/common';
import { AdminDashboardService } from './admin-dashboard.service';

@Controller('v1/admin-dashboard/')
export class AdminDashboardController {
  constructor(private readonly adminDashboardService: AdminDashboardService) {}

  @Get('active-users')
  findAllActiveUsers() {
    return this.adminDashboardService.findAllActiveUsers();
  }

  @Get('inactive-users')
  findAllInactiveUsers() {
    return this.adminDashboardService.findAllInactiveUsers();
  }

  @Post('active-user/:id')
  activeUser(@Param('id') id: number) {
    return this.adminDashboardService.activeUser(id);
  }

  @Delete('deactive-user/:id')
  deactiveUser(@Param('id') id: number) {
    return this.adminDashboardService.deactiveUser(id);
  }

  @Get('active-instructors')
  findAllActiveInstructors() {
    return this.adminDashboardService.findAllactiveInstructors();
  }

  @Get('inactive-instructors')
  findAllInactiveInstructors() {
    return this.adminDashboardService.findAllInactiveInstructors();
  }

  @Post('active-instructor/:id')
  activeInstructor(@Param('id') id: number) {
    return this.adminDashboardService.activeInstructor(id);
  }

  @Delete('deactive-instructor/:id')
  deactiveInstructor(@Param('id') id: number) {
    return this.adminDashboardService.deactiveInstructor(id);
  }

  @Delete('/courses/:id')
  removeCourse(@Param('id') id: number) {
    return this.adminDashboardService.removeCourse(id);
  }

  @Delete('/reviews/:id')
  removeReview(@Param('id') id: number) {
    return this.adminDashboardService.removeReview(id);
  }
}
