import {
  IsDateString,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateDoctorBlockDto {

  @IsString()
  doctorId!: string;

  @IsDateString()
  date!: string;

  @IsOptional()
  @IsString()
  reason?: string;
}