import { Module } from '@nestjs/common';
import { DoctorScheduleBlockService } from './doctor-schedule-block.service';
import { DoctorScheduleBlockController } from './doctor-schedule-block.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { DoctorModule } from '../doctor/doctor.module';
import { DoctorScheduleBlockValidator } from './validators/doctor-schedule-block.validator';

@Module({
  imports: [PrismaModule, DoctorModule],
  controllers: [DoctorScheduleBlockController],
  providers: [DoctorScheduleBlockService, DoctorScheduleBlockValidator],
})
export class DoctorScheduleBlockModule {}
