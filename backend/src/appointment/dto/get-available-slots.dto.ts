import { IsDateString, IsString } from "class-validator";

export class GetAvailableSlotsDto {

  @IsString()
  doctorId!: string;

  @IsString()
  serviceId!: string;

  @IsDateString()
  date!: string;
}