// src/appointment/dto/get-availability-summary.dto.ts
import { IsDateString, IsString } from 'class-validator';

export class GetAvailabilitySummaryDto {
  @IsString()
  doctorId!: string;

  @IsString()
  serviceId!: string;

  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;
}