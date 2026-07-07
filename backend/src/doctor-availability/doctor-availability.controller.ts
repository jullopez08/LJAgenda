import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { DoctorAvailabilityService } from './doctor-availability.service';
import { CreateDoctorAvailabilityDto } from './dto/create-doctor-availability.dto';
import { UpdateDoctorAvailabilityDto } from './dto/update-doctor-availability.dto';

@Controller('doctor-availability')
export class DoctorAvailabilityController {
    constructor(
        private readonly doctorAvailabilityService: DoctorAvailabilityService
    ){}

    @Post()
    create(@Body() createDoctorAvailabilityDto: CreateDoctorAvailabilityDto){
        return this.doctorAvailabilityService.create(createDoctorAvailabilityDto)
    }

    
    @Get()
    findAll() {
        return this.doctorAvailabilityService.findAll();
    }
    
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.doctorAvailabilityService.findOne(id);
    }
    
    @Patch(':id')
    update( @Param('id') id: string,  @Body() updateDoctorAvailabilityDto: UpdateDoctorAvailabilityDto) {
        return this.doctorAvailabilityService.update(id, updateDoctorAvailabilityDto);
    }
    
    @Delete(':id')
    remove(@Param('id') id: string) {
     return this.doctorAvailabilityService.remove(id);
    }
}
