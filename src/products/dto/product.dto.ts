import { PartialType } from '@nestjs/mapped-types';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsPositive,
  IsUrl,
  MinLength,
} from 'class-validator';

export class BaseProductDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10, { message: 'Description must be at least 10 characters long' })
  description: string;

  @IsNumber({}, { message: 'Price must be a number' })
  @IsNotEmpty({ message: 'Price is required' })
  @IsPositive({ message: 'Price must be a positive number' })
  price: number;

  @IsOptional()
  @IsUrl({}, { message: 'Image URL must be a valid URL' })
  imageUrl?: string;

  @IsString()
  categoryName: string;
}

export class CreateProductDto extends BaseProductDto {
  @IsOptional()
  supplier: string;
}

export class UpdateProductDto extends PartialType(BaseProductDto) {}
