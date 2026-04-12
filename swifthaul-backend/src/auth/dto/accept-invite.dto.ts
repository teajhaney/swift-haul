import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { VehicleType } from '@prisma/client';

export class AcceptInviteDto {
  @IsString()
  @MinLength(1)
  token!: string;

  @IsString()
  @MinLength(1)
  name!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  // Required only when the invited user has role = DRIVER
  @IsOptional()
  @IsEnum(VehicleType)
  vehicleType?: VehicleType;

  @IsOptional()
  @IsString()
  @MinLength(1)
  vehiclePlate?: string;
}
