import { IsString } from 'class-validator';

export class SearchAppointmentDto {
  @IsString()
  identification!: string;
}