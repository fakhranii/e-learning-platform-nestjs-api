import { IsNotEmpty, IsString } from 'class-validator';

export class SignInUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}
