import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Min,
} from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    employee_id?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    role_id?: number;

    @IsOptional()
    @IsString()
    @MinLength(3)
    @MaxLength(100)
    login?: string;

    @IsOptional()
    @IsString()
    @MinLength(6)
    @MaxLength(100)
    password?: string;
}