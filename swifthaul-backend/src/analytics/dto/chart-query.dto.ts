import { IsDateString, IsEnum, IsOptional } from 'class-validator';

export class ChartQueryDto {
  @IsOptional()
  @IsEnum(['7d', '30d', '90d'])
  range?: '7d' | '30d' | '90d' = '7d';

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
