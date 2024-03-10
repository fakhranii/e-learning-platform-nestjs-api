import { IsNotEmpty, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty()
  rating: number;

  @IsNotEmpty()
  @IsString()
  reviewBody: string;
}
