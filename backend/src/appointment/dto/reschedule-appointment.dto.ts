
import { IsDateString, IsString, Matches } from 'class-validator';

export class RescheduleAppointmentDto {

  @IsDateString()
  appointmentDate!: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  appointmentTime!: string;
}