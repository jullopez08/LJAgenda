import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DoctorScheduleBlockService } from './doctor-schedule-block.service';
import { CreateDoctorScheduleBlockDto } from './dto/create-doctor-schedule-block.dto';
import { UpdateDoctorScheduleBlockDto } from './dto/update-doctor-schedule-block.dto';

@Controller('doctor-schedule-block')
export class DoctorScheduleBlockController {
  constructor(private readonly doctorScheduleBlockService: DoctorScheduleBlockService) {}

  @Post()
  create(@Body() dto: CreateDoctorScheduleBlockDto) {
    return this.doctorScheduleBlockService.create(dto);
  }

  @Get()
  findAll() {
    return this.doctorScheduleBlockService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doctorScheduleBlockService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dtoUpdate: UpdateDoctorScheduleBlockDto) {
    return this.doctorScheduleBlockService.update(id, dtoUpdate);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doctorScheduleBlockService.remove(id);
  }
}
