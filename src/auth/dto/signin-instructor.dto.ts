import { IsNotEmpty, IsString } from 'class-validator';

export class SignInInstructorDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}
