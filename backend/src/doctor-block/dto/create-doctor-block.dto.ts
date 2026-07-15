import {
  IsDateString,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateDoctorBlockDto {

  @IsString()
  doctorId!: string;

  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;

  @IsOptional()
  @IsString()
  reason?: string;
}