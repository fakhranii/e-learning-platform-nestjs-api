import { Module } from '@nestjs/common';
import { InstructorService } from './instructor.service';
import { InstructorController } from './instructor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Instructor } from './entities/instructor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Instructor])],
  controllers: [InstructorController],
  providers: [InstructorService],
})
export class InstructorModule {}
