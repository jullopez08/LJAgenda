import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PatientsModule } from './patients/patients.module';
import { PrismaModule } from './prisma/prisma.module';
import { DoctorAvailabilityModule } from './doctor-availability/doctor-availability.module';
import { DoctorModule } from './doctor/doctor.module';
import { ServiceModule } from './service/service.module';
import { DoctorBlockModule } from './doctor-block/doctor-block.module';
import { AppointmentModule } from './appointment/appointment.module';
import { HolidayModule } from './holiday/holiday.module';
import { DoctorScheduleBlockModule } from './doctor-schedule-block/doctor-schedule-block.module';

@Module({
  imports: [PatientsModule, PrismaModule, DoctorAvailabilityModule, DoctorModule, ServiceModule, DoctorBlockModule, AppointmentModule, HolidayModule, DoctorScheduleBlockModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
