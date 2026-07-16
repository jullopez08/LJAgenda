import { PartialType } from '@nestjs/mapped-types';
import { CreateDoctorScheduleBlockDto } from './create-doctor-schedule-block.dto';

export class UpdateDoctorScheduleBlockDto extends PartialType(CreateDoctorScheduleBlockDto) {}
