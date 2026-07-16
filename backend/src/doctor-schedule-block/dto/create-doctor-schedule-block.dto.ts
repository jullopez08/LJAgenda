import { IsDateString, IsOptional, IsString, Matches } from "class-validator";

export class CreateDoctorScheduleBlockDto {
@IsString()
doctorId!: string;

@IsDateString()
date!: string;

@Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
startTime!: string;

@Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
endTime!: string;

@IsOptional()
@IsString()
reason?: string;    
}
