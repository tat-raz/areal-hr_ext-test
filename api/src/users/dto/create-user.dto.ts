import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Min,
} from 'class-validator';

export class CreateUserDto {
    @Type(() => Number)
    @IsInt()
    @Min(1)
    employee_id: number;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    role_id: number;

    @IsString()
    @MinLength(3)
    @MaxLength(100)
    login: string;

    @IsString()
    @MinLength(6)
    @MaxLength(100)
    password: string;
}