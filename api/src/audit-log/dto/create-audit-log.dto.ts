import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateAuditLogDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  user_id: number;

  @IsString()
  @MaxLength(100)
  entity_type: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  entity_id: number;

  @IsString()
  @MaxLength(100)
  field_name: string;

  @IsOptional()
  @IsString()
  old_value?: string | null;

  @IsOptional()
  @IsString()
  new_value?: string | null;
}