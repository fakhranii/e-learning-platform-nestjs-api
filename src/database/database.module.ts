import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      url: process.env.DB_URl,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: false, //* true only on dev env
      ssl: {
        ca: null, // Not using CA certificate
        rejectUnauthorized: false, // Reject unauthorized connections in production
      },
    }),
  ],
})
export class DatabaseModule {}
