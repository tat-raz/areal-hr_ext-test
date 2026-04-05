import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsString, MaxLength, Min, IsDateString } from 'class-validator';

export class CreateHrOperationDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  employee_id: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  department_id: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  position_id: number;

  @IsString()
  @MaxLength(50)
  operation_type: string;

  @IsDateString()
  operation_date: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  salary: number;
}