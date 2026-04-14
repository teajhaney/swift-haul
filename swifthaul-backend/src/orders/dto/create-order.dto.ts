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

export class CreateOrderDto {
  @IsString()
  @MinLength(1)
  senderName!: string;

  @IsString()
  @MinLength(1)
  senderPhone!: string;

  @IsString()
  @MinLength(1)
  recipientName!: string;

  @IsString()
  @MinLength(1)
  recipientPhone!: string;

  @IsOptional()
  @IsEmail()
  recipientEmail?: string;

  @IsString()
  @MinLength(1)
  pickupAddress!: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  pickupLat?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  pickupLng?: number;

  @IsString()
  @MinLength(1)
  deliveryAddress!: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  deliveryLat?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  deliveryLng?: number;

  @IsString()
  @MinLength(1)
  packageDescription!: string;

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
