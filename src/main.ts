import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { SanitizeHtmlPipe } from './utils/sanitizeHtml-pipe';
import * as compression from 'compression';
import rateLimit from 'express-rate-limit';
import * as csurf from 'csurf';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.use(csurf({ cookie: true }));

  app.use(express.json({ limit: '10kb' }));

  app.use(
    rateLimit({
      windowMs: 10 * 60 * 1000, // 10 minutes
      max: 50, // limit each IP to 50 requests per windowMs
      message: 'You have exceeded the 50 requests in 10 minutes limit!',
      headers: true, // include rate limit headers in the response
      handler: (req, res) => {
        res.status(429).json({
          status: 'error',
          message: 'Too many requests, please try again later.',
        });
      },
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalPipes(new SanitizeHtmlPipe());

  app.enableCors(); // <- enable CORS

  app.use(compression());

  await app.listen(3000);
}

bootstrap();
