import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { GetAvailableSlotsDto } from './dto/get-available-slots.dto';
import { RescheduleAppointmentDto } from './dto/reschedule-appointment.dto';

@Controller('appointment')
export class AppointmentController {
    constructor(private readonly appointmentService: AppointmentService) { }
// publicos
    @Post()
    create(@Body() createAppointmentDto: CreateAppointmentDto) {
        return this.appointmentService.create(createAppointmentDto)
    }
    @Get('available-slots')
    getAvailableSlots(
        @Query() query: GetAvailableSlotsDto
    ) {
        return this.appointmentService.getAvailableSlots(
            query.doctorId,
            query.serviceId,
            query.date,
        );
    }
    @Get(':id')
    findOne(
        @Param('id') id: string,
    ) {
        return this.appointmentService.findOne(id);
    }
    @Patch(':id/cancel')
    cancel(
        @Param('id') id: string,
    ) {
        return this.appointmentService.cancel(id);
    }
    @Patch(':id/reschedule')
    reschedule(
        @Param('id') id: string,
        @Body() dto: RescheduleAppointmentDto,
    ) {
        return this.appointmentService.reschedule(
            id,
            dto,
        );
    }

}
