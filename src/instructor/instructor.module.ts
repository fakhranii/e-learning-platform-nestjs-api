import { Module } from '@nestjs/common';
import { InstructorService } from './instructor.service';
import { InstructorController } from './instructor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Instructor } from './entities/instructor.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { Exceptions } from 'src/common/Exceptions';

@Module({
  imports: [TypeOrmModule.forFeature([Instructor]), CloudinaryModule],
  controllers: [InstructorController],
  providers: [InstructorService, Exceptions],
})
export class InstructorModule {}
