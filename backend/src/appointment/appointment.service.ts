import {  Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AppointmentValidators } from './validators/appointment.validators';

@Injectable()
export class AppointmentService {
    constructor(
        private readonly validators: AppointmentValidators
    ){}
     
async create(dto: CreateAppointmentDto) {

 const doctor =  await this.validators.validateDoctor(dto.doctorId);

 await this.validators.validatePatient(dto.patientId);

 const service = await this.validators.validateService(dto.serviceId);

 await this.validators.validateDoctorBlock(doctor, dto);

 await this.validators.validateHoliday(dto);

 await this.validators.validateAvailability(doctor, service, dto);

 await this.validators.validateDoctorScheduleBlock(doctor, service, dto);
 
 await this.validators.validateAppointmentConflict(doctor, service, dto);

 return this.validators.saveAppointment(dto)

  }

  async getAvailableSlots(
    doctorId: string,
    serviceId: string,
    date: string,
){

}


}
