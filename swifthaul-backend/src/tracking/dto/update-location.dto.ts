import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateLocationDto {
  @IsString()
  @MinLength(1)
  referenceId!: string;

  @IsNumber()
  @Type(() => Number)
  lat!: number;

  @IsNumber()
  @Type(() => Number)
  lng!: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  speed?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  heading?: number;
}
