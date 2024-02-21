import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule); //* inject the server content via app module
  await app.listen(3000);
  // localhost:3000/v1/user => localhost
  // herko/GP/v1/user => online cloud

  // youssef.listen(yousef)
  //  Get localhost:3000/user
}

bootstrap();
//* entry file.
