import { Controller, Body, Post, Get } from '@nestjs/common';

@Controller('v1')
export class AppController {
  @Get()
  sayHello() {
    return 'Hello World';
  }
}
