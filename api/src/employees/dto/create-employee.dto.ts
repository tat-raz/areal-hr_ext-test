import { IsDateString, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateEmployeeDto {

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  first_name: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  last_name: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  middle_name?: string;

  @IsDateString()
  birth_date: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  passport_series?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  passport_number?: string;

  @IsOptional()
  @IsDateString()
  passport_issue_date?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  passport_code?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  passport_issued_by?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  registration_address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  registration_city?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  registration_street?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  registration_house?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  registration_building?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  registration_apartment?: string;
}