import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreatePositionDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  comment?: string;
}