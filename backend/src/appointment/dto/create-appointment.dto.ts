import { IsDateString, IsOptional, IsString, Matches } from "class-validator";

export class CreateAppointmentDto {

    @IsString()
    doctorId!: string;

    @IsString()
    patientId!: string;

    @IsString()
    serviceId!: string;

    @IsDateString()
    appointmentDate!: string;

    @IsString()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    appointmentTime!: string

    @IsString()
@IsOptional()
    observations?: string;

}