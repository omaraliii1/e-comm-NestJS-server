import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { EUserRole } from '../enums/user.enum';
import { Transform } from 'class-transformer';

export class BaseUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @IsOptional()
  @IsString()
  phone_number?: string;

  @IsOptional()
  @IsEnum(EUserRole)
  role?: EUserRole;
}

export class CreateUserDto extends BaseUserDto {
  @IsString()
  @MinLength(6)
  password: string;
}

export class UpdateUserDto extends PartialType(BaseUserDto) {}
