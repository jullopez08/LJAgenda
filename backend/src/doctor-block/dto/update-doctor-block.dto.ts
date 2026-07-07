import { PartialType } from '@nestjs/mapped-types';
import { CreateDoctorBlockDto } from './create-doctor-block.dto';

export class UpdateDoctorBlockDto extends PartialType(CreateDoctorBlockDto) {}