import { IsEmail, IsEnum } from 'class-validator';
import { Role } from '@prisma/client';

export class InviteDto {
  @IsEmail()
  email!: string;

  @IsEnum(Role)
  role!: Role;
}
