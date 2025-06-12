import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class BaseCartDto {
  @IsMongoId()
  @IsNotEmpty()
  user: string;

  @IsMongoId()
  @IsOptional()
  product?: string;

  @IsNumber()
  @Min(0)
  totalPrice: number;
}

export class CreateCartDto extends BaseCartDto {}

export class UpdateCartDto extends PartialType(BaseCartDto) {}
