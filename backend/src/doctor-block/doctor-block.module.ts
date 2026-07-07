import { Module } from '@nestjs/common';
import { DoctorBlockController } from './doctor-block.controller';
import { DoctorBlockService } from './doctor-block.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DoctorBlockController],
  providers: [DoctorBlockService]
})
export class DoctorBlockModule {}
