import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty()
  @IsString()
  courseName: string;

  @IsString()
  @IsNotEmpty()
  courseDescription: string;

  @IsNotEmpty()
  courseLink: string;

  @IsNotEmpty()
  prerequisites: string;

  @IsNotEmpty()
  @IsString()
  courseType: string;
}
