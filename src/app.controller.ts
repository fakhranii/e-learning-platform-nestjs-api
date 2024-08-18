import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('v1')
export class AppController {
  @Get()
  provideCsrfToken(@Req() request: Request, @Res() response: Response) {
    response.render('form', { csrfToken: request.csrfToken() });
  }
}
