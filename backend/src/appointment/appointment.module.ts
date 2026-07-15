import { Module } from '@nestjs/common';
import { AppointmentController } from './appointment.controller';
import { AppointmentValidators } from './validators/appointment.validators';
import { AppointmentService } from './appointment.service';
import { PrismaModule } from '../prisma/prisma.module';
import { DoctorModule } from '../doctor/doctor.module';
import { PatientsModule } from '../patients/patients.module';
import { ServiceModule } from '../service/service.module';
import { HolidayModule } from '../holiday/holiday.module';

@Module({
  imports:[PrismaModule, DoctorModule, PatientsModule, ServiceModule, HolidayModule],
  controllers: [AppointmentController],
  providers: [AppointmentService, AppointmentValidators]
})
export class AppointmentModule {}
