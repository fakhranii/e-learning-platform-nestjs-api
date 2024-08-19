import { Controller, Get, Delete, Param, Post } from '@nestjs/common';
import { AdminDashboardService } from './admin-dashboard.service';

@Controller('v1/admin-dashboard/')
export class AdminDashboardController {
  constructor(private readonly adminDashboardService: AdminDashboardService) {}

  @Get('activeUsers')
  findAllActiveUsers() {
    return this.adminDashboardService.findAllActiveUsers();
  }

  @Get('inactiveUsers')
  findAllInactiveUsers() {
    return this.adminDashboardService.findAllInactiveUsers();
  }

  @Post('activeUser/:id')
  activeUser(@Param('id') id: number) {
    return this.adminDashboardService.activeUser(id);
  }

  @Delete('deactiveUser/:id')
  deactiveUser(@Param('id') id: number) {
    return this.adminDashboardService.deactiveUser(id);
  }

  @Get('activeInstructors')
  findAllActiveInstructors() {
    return this.adminDashboardService.findAllactiveInstructors();
  }

  @Get('inactiveInstructors')
  findAllInactiveInstructors() {
    return this.adminDashboardService.findAllInactiveInstructors();
  }

  @Post('activeInstructor/:id')
  activeInstructor(@Param('id') id: number) {
    return this.adminDashboardService.activeInstructor(id);
  }

  @Delete('deactiveInstructor/:id')
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
