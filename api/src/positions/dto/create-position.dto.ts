import { IsInt, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreatePositionDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name: string;

  @IsInt()
  @IsOptional()
  department_id?: number;

  @IsOptional()
  @IsString()
  comment?: string;
}