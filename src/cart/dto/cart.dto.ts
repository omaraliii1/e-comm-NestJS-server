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
}

export class CreateCartDto extends BaseCartDto {}
