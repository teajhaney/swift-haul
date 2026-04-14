import { IsOptional, IsString, MinLength } from 'class-validator';

export class AssignDriverDto {
  @IsString()
  @MinLength(1)
  driverId!: string;

  @IsOptional()
  @IsString()
  note?: string;
}
