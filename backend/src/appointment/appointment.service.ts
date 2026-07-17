import { Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AppointmentValidators } from './validators/appointment.validators';
import { DoctorScheduleQueryService } from '../common/doctor-schedule-query.service.ts';
import { getAppointmentDuration, getCurrentTime, hasSlotConflict } from './helpers/appointment-slot';
import { generateSlots } from './helpers/appointment-slot';
import { addMinutes, hasTimeConflict } from './helpers/appointment-time';
import { isToday } from './helpers/appointment-date';

@Injectable()
export class AppointmentService {
    constructor(
        private readonly validators: AppointmentValidators,
        private readonly queryService: DoctorScheduleQueryService
    ) { }

    async create(dto: CreateAppointmentDto) {

        const doctor = await this.validators.validateDoctor(dto.doctorId);

        await this.validators.validatePatient(dto.patientId);

        const service = await this.validators.validateService(dto.serviceId);

        await this.validators.validateDoctorBlock(doctor, dto.appointmentDate);

        await this.validators.validateHoliday(dto.appointmentDate);

        await this.validators.validateAvailability(doctor, service, dto);

        await this.validators.validateDoctorScheduleBlock(doctor, service, dto);

        await this.validators.validateAppointmentConflict(doctor, service, dto);

        return this.validators.saveAppointment(dto)

    }

    async getAvailableSlots(doctorId: string,serviceId: string, date: string) {

        const doctor = await this.validators.validateDoctor(doctorId);

        const service = await this.validators.validateService(serviceId);
       
        await this.validators.validateDoctorBlock(doctor, date);
        
        await this.validators.validateHoliday(date);

        const availabilities = await this.queryService.getDoctorAvailabilities(doctorId, date);

        const blocks = await this.queryService.getDoctorScheduleBlocks(doctorId, date);

        const appointments = await this.queryService.getAppointments(doctorId, date);

        const appointmentDuration =
            getAppointmentDuration(
                service.duration,
                doctor.slotGap,
            );

        let availableSlots: string[] = [];

        for (const availability of availabilities) {

            const slots = generateSlots(
                availability.startTime,
                availability.endTime,
                appointmentDuration,
            );

            availableSlots.push(...slots);
        }

        availableSlots = availableSlots.filter((slot) => {

            const hasBlockConflict = blocks.some((block) =>
                hasSlotConflict(
                    slot,
                    appointmentDuration,
                    block.startTime,
                    block.endTime,
                ),
            );

            return !hasBlockConflict;
        });

        availableSlots = availableSlots.filter((slot) => {

            const hasAppointmentConflict = appointments.some((appointment) => {

                const currentAppointmentDuration =
                    getAppointmentDuration(
                        appointment.service.duration,
                        doctor.slotGap,
                    );

                return hasSlotConflict(
                    slot,
                    appointmentDuration,
                    appointment.appointmentTime,
                    addMinutes(
                        appointment.appointmentTime,
                        currentAppointmentDuration,
                    ),
                );
            });

            return !hasAppointmentConflict;
        });
        if (isToday(date)) {

            const currentTime = getCurrentTime();

            availableSlots = availableSlots.filter(
                (slot) => slot > currentTime,
            );
          const today = new Date();
const selectedDate = new Date(date);

console.log({
    today,
    selectedDate,
});

        }
        return availableSlots;
    }




}
