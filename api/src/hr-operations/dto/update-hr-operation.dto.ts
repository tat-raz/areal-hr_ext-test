import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateHrOperationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  employee_id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  department_id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  position_id?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  operation_type?: string;

  @IsOptional()
  @IsDateString()
  operation_date?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  salary?: number;
}