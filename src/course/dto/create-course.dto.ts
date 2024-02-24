import { IsNotEmpty } from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty()
  courseName: string;

  @IsNotEmpty()
  courseDkescription: string;

  @IsNotEmpty()
  prerequisites: string;

  @IsNotEmpty()
  courseType: string;
}
