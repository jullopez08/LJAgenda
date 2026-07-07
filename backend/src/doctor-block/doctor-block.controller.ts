import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { DoctorBlockService } from './doctor-block.service';
import { CreateDoctorBlockDto } from './dto/create-doctor-block.dto';
import { UpdateDoctorBlockDto } from './dto/update-doctor-block.dto';

@Controller('doctor-block')
export class DoctorBlockController {

  constructor(
    private readonly doctorBlockService: DoctorBlockService,
  ) {}

  @Post()
  create(@Body() createDoctorBlockDto: CreateDoctorBlockDto) {
    return this.doctorBlockService.create(createDoctorBlockDto);
  }

  @Get()
  findAll() {
    return this.doctorBlockService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doctorBlockService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDoctorBlockDto: UpdateDoctorBlockDto,
  ) {
    return this.doctorBlockService.update(id, updateDoctorBlockDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doctorBlockService.remove(id);
  }
}