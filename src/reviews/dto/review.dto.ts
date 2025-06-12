import { PartialType } from '@nestjs/mapped-types';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  Max,
  IsMongoId,
} from 'class-validator';

export class BaseReviewDto {
  @IsInt({ message: 'Rating must be an integer' })
  @IsNotEmpty({ message: 'Rating is required' })
  @Min(1, { message: 'Rating must be at least 1' })
  @Max(5, { message: 'Rating must be at most 5' })
  rating: number;

  @IsOptional()
  @IsString({ message: 'Comment must be a string' })
  comment?: string;

  @IsString({ message: 'Product ID must be a string' })
  @IsNotEmpty({ message: 'Product ID is required' })
  @IsMongoId({ message: 'Product ID must be a valid MongoDB ObjectId' })
  productId: string;
}

export class CreateReviewDto extends BaseReviewDto {}

export class UpdateReviewDto extends PartialType(BaseReviewDto) {}
