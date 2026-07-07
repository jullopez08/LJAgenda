import { Module } from '@nestjs/common';
import { DoctorAvailabilityService } from './doctor-availability.service';
import { DoctorAvailabilityController } from './doctor-availability.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [DoctorAvailabilityService],
  controllers: [DoctorAvailabilityController]
})
export class DoctorAvailabilityModule {}
