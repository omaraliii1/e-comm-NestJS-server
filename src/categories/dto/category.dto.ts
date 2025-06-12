import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class BaseCategoryDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;
}

export class CreateCategoryDto extends BaseCategoryDto {}

export class UpdateCategoryDto extends PartialType(BaseCategoryDto) {}
