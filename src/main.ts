import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { SanitizeHtmlPipe } from './utils/sanitizeHtml-pipe';
import * as compression from 'compression';
import rateLimit from 'express-rate-limit';
import * as csurf from 'csurf';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as hpp from 'hpp';
import helmet from 'helmet';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  app.use(cookieParser()); // should implement this line before ➡   app.use(csurf({ cookie: true }));
  app.use(csurf({ cookie: true }));

  app.use(express.json({ limit: '10kb' }));

  // Rate Limiting to prevent DOS attacks
  app.use(
    rateLimit({
      windowMs: 10 * 60 * 1000, // 10 minutes
      max: 50, // limit each IP to 50 requests per windowMs
      message: 'You have exceeded the 50 requests in 10 minutes limit!',
      headers: true,
      handler: (req, res) => {
        res.status(429).json({
          status: 'error',
          message: 'Too many requests, please try again later.',
        });
      },
    }),
  );

  // Data Validation and Sanitization
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalPipes(new SanitizeHtmlPipe());

  // Enable Cross-Origin Resource Sharing (CORS)
  app.enableCors();

  // HTTP Parameter Pollution Prevention
  app.use(
    hpp({
      // whitelist: [], // Uncomment and add parameters if needed
    }),
  );

  // Response Compression for better performance
  app.use(compression());
  await app.listen(3000);
}

bootstrap();
