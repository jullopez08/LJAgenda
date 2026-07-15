import { Body, Controller, Post } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Controller('appointment')
export class AppointmentController {
    constructor( private readonly appointmentService: AppointmentService){}

    @Post()
    create(@Body() createAppointmentDto: CreateAppointmentDto){
        return this.appointmentService.create(createAppointmentDto)
    }
}
