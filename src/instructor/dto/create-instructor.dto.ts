import { IsNotEmpty, IsString } from 'class-validator';

export class CreateInstructorDto {
  @IsString()
  instructorDescription: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsString()
  avatar: string;
}
