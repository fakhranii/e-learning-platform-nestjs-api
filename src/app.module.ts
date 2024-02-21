import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database connection/database.module';
import { UserModule } from './user/user.module';

@Module({ 
  //? app module is the root module
  //* app module is the parent of the whole project, all moduls must be imported here!
  // all project modules.
  imports: [DatabaseModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
