import { IdentificationType } from '@prisma/client';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateAppointmentDto {

  // Doctor
  @IsString()
  doctorId!: string;

  // Servicio
  @IsString()
  serviceId!: string;

  // Datos del paciente
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

  // Cita
  @IsDateString()
  appointmentDate!: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  appointmentTime!: string;

  @IsOptional()
  @IsString()
  observations?: string;
}