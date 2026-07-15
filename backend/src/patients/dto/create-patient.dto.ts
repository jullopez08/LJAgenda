import { IdentificationType } from '@prisma/client';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreatePatientDto {
  @IsEnum(IdentificationType)
  identificationType!: IdentificationType;

  @IsString()
  identification!: string;

  @IsString()
  name!: string;

  @IsString()
  phone!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}