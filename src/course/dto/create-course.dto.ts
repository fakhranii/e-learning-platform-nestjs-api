import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsString()
  @IsNotEmpty()
  courseDescription: string;

  @IsNotEmpty()
  courseLink: string;

  @IsNotEmpty()
  prerequisites: string;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsString()
  skillLevel: string;

  @IsString()
  whatYouWillLearn: string;

  @IsString()
  language: string;

  @IsString()
  isCertified: string;
}
