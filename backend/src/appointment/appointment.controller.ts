import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Controller('appointment')
export class AppointmentController {
    constructor( private readonly appointmentService: AppointmentService){}

    @Post()
    create(@Body() createAppointmentDto: CreateAppointmentDto){
        return this.appointmentService.create(createAppointmentDto)
    }
    @Get('available-slots')
getAvailableSlots(
  @Query('doctorId') doctorId: string,
  @Query('serviceId') serviceId: string,
  @Query('date') date: string,
){
    return this.appointmentService.getAvailableSlots(
        doctorId,
        serviceId,
        date,
    );
}
}
