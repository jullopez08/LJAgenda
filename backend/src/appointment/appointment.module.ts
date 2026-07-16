import { Module } from '@nestjs/common';
import { AppointmentController } from './appointment.controller';
import { AppointmentValidators } from './validators/appointment.validators';
import { AppointmentService } from './appointment.service';
import { PrismaModule } from '../prisma/prisma.module';
import { DoctorModule } from '../doctor/doctor.module';
import { PatientsModule } from '../patients/patients.module';
import { ServiceModule } from '../service/service.module';
import { HolidayModule } from '../holiday/holiday.module';
import { DoctorScheduleBlockModule } from '../doctor-schedule-block/doctor-schedule-block.module';
import { DoctorScheduleQueryService } from '../common/doctor-schedule-query.service.ts';

@Module({
  imports:[PrismaModule, DoctorModule, PatientsModule, ServiceModule, HolidayModule, DoctorScheduleBlockModule],
  controllers: [AppointmentController],
  providers: [AppointmentService, AppointmentValidators, DoctorScheduleQueryService]
})
export class AppointmentModule {}
