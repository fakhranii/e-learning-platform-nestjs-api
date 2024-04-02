import { Module } from '@nestjs/common';
import { InstructorService } from './instructor.service';
import { InstructorController } from './instructor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Instructor } from './entities/instructor.entity';
<<<<<<< HEAD
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([Instructor]), CloudinaryModule],
=======

@Module({
  imports: [TypeOrmModule.forFeature([Instructor])],
>>>>>>> 65018de (init)
  controllers: [InstructorController],
  providers: [InstructorService],
})
export class InstructorModule {}
