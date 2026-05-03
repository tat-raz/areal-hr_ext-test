import { IsOptional, IsString, MaxLength, MinLength, IsInt } from 'class-validator';

export class UpdatePositionDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @IsInt()
  department_id?: number;

  @IsOptional()
  @IsString()
  comment?: string;
}