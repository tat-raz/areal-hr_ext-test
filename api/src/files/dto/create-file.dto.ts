import { Type } from 'class-transformer';
import { IsInt, IsString, MaxLength, Min } from 'class-validator';

export class CreateFileDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  employee_id: number;

  @IsString()
  @MaxLength(255)
  name: string;

  @IsString()
  file_path: string;
}