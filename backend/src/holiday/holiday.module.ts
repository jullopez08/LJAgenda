import { Module } from '@nestjs/common';
import { HolidayService } from './holiday.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [HolidayService],
  exports: [HolidayService],
})
export class HolidayModule {}
