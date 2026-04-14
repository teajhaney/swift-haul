import {
  IsEmail,
  IsEnum,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Priority } from '@prisma/client';

export class UpdateOrderDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  senderName?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  senderPhone?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  recipientName?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  recipientPhone?: string;

  @IsOptional()
  @IsEmail()
  recipientEmail?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  pickupAddress?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  pickupLat?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  pickupLng?: number;

  @IsOptional()
  @IsString()
  @MinLength(1)
  deliveryAddress?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  deliveryLat?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  deliveryLng?: number;

  @IsOptional()
  @IsString()
  @MinLength(1)
  packageDescription?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  weightKg?: number;

  @IsOptional()
  @IsString()
  dimensions?: string;

  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsISO8601()
  scheduledPickupTime?: string;

  @IsOptional()
  @IsISO8601()
  estimatedDelivery?: string;
}
