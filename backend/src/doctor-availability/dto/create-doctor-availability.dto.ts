import { WeekDay } from '@prisma/client';
import {
  IsEnum,
  IsString,
  IsNotEmpty,
} from 'class-validator';

export class CreateDoctorAvailabilityDto {

  @IsString()
  @IsNotEmpty()
  doctorId!: string;

  @IsEnum(WeekDay)
  day!: WeekDay;

  @IsString()
  @IsNotEmpty()
  startTime!: string;

  @IsString()
  @IsNotEmpty()
  endTime!: string;
}