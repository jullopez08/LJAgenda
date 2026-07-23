import { Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AppointmentValidators } from './validators/appointment.validators';
import { DoctorScheduleQueryService } from '../common/doctor-schedule-query.service';
import { getAppointmentDuration, getCurrentTime, hasSlotConflict } from './helpers/appointment-slot';
import { generateSlots } from './helpers/appointment-slot';
import { addMinutes, timeToMinutes } from './helpers/appointment-time';
import { isToday } from './helpers/appointment-date';
import { RescheduleAppointmentDto } from './dto/reschedule-appointment.dto';
import { AppointmentStatus } from '@prisma/client';
import { StatusValidators } from './validators/appointment-state.validator';
import { GetAppointmentsDto } from './dto/get-appointments.dto';

@Injectable()
export class AppointmentService {
    constructor(
        private readonly validators: AppointmentValidators,
        private readonly queryService: DoctorScheduleQueryService,
        private readonly stateValidator: StatusValidators
    ) { }

    async create(dto: CreateAppointmentDto) {

        const doctor = await this.validators.validateDoctor(dto.doctorId);

        const service = await this.validators.validateService(dto.serviceId);
        
        const patient = await this.validators.findOrCreatePatient(dto)

        await this.validators.validateDoctorBlock(doctor, dto.appointmentDate);

        await this.validators.validateHoliday(dto.appointmentDate);

        await this.validators.validateAvailability(doctor, service, dto);

        await this.validators.validateDoctorScheduleBlock(doctor, service, dto);

        await this.validators.validateAppointmentConflict(doctor, service, dto);

        return this.validators.saveAppointment(dto, patient.id)

    }

   async getAvailableSlots(doctorId: string, serviceId: string, date: string) {

    const doctor = await this.validators.validateDoctor(doctorId);
    const service = await this.validators.validateService(serviceId);

    await this.validators.validateDoctorBlock(doctor, date);
    await this.validators.validateHoliday(date);

    const availabilities = await this.queryService.getDoctorAvailabilities(doctorId, date);
    const blocks = await this.queryService.getDoctorScheduleBlocks(doctorId, date);
    const appointments = await this.queryService.getAppointments(doctorId, date);

    const appointmentDuration = getAppointmentDuration(service.duration, doctor.slotGap);

    let allSlots: string[] = [];
    for (const availability of availabilities) {
        allSlots.push(...generateSlots(availability.startTime, availability.endTime, appointmentDuration));
    }

    const currentTime = isToday(date) ? getCurrentTime() : null;

    return allSlots.map((slot) => {
        const hasBlockConflict = blocks.some((block) =>
            hasSlotConflict(slot, appointmentDuration, block.startTime, block.endTime));

        const hasAppointmentConflict = appointments.some((appointment) => {
            const dur = getAppointmentDuration(appointment.service.duration, doctor.slotGap);
            return hasSlotConflict(slot, appointmentDuration, appointment.appointmentTime,
                addMinutes(appointment.appointmentTime, dur));
        });

        const isPast = currentTime !== null && timeToMinutes(slot) <= timeToMinutes(currentTime);

        return { time: slot, disabled: hasBlockConflict || hasAppointmentConflict || isPast };
    });
}
async getAvailabilitySummary(
    doctorId: string,
    serviceId: string,
    startDate: string,
    endDate: string,
) {
    const doctor = await this.validators.validateDoctor(doctorId);
    const service = await this.validators.validateService(serviceId);

    const dates = this.getDateRange(startDate, endDate);
    const appointmentDuration = getAppointmentDuration(service.duration, doctor.slotGap);

    const summary: { date: string; available: boolean }[] = [];

    for (const date of dates) {
        let available = false;

        try {
            await this.validators.validateDoctorBlock(doctor, date);
            await this.validators.validateHoliday(date);

            const availabilities = await this.queryService.getDoctorAvailabilities(doctorId, date);

            if (availabilities.length > 0) {
                const blocks = await this.queryService.getDoctorScheduleBlocks(doctorId, date);
                const appointments = await this.queryService.getAppointments(doctorId, date);

                let allSlots: string[] = [];
                for (const availability of availabilities) {
                    allSlots.push(...generateSlots(availability.startTime, availability.endTime, appointmentDuration));
                }

                const currentTime = isToday(date) ? getCurrentTime() : null;

                available = allSlots.some((slot) => {
                    const hasBlockConflict = blocks.some((block) =>
                        hasSlotConflict(slot, appointmentDuration, block.startTime, block.endTime));

                    const hasAppointmentConflict = appointments.some((appointment) => {
                        const dur = getAppointmentDuration(appointment.service.duration, doctor.slotGap);
                        return hasSlotConflict(slot, appointmentDuration, appointment.appointmentTime,
                            addMinutes(appointment.appointmentTime, dur));
                    });

                    const isPast = currentTime !== null && timeToMinutes(slot) <= timeToMinutes(currentTime);

                    return !hasBlockConflict && !hasAppointmentConflict && !isPast;
                });
            }
        } catch {
            // Festivo, bloqueo de vacaciones, fecha inválida, etc. -> día no disponible
            available = false;
        }

        summary.push({ date, available });
    }

    return summary;
}

private getDateRange(startDate: string, endDate: string): string[] {
    const dates: string[] = [];
    const [sy, sm, sd] = startDate.split('-').map(Number);
    const [ey, em, ed] = endDate.split('-').map(Number);

    let current = new Date(sy, sm - 1, sd);
    const end = new Date(ey, em - 1, ed);

    while (current <= end) {
        const y = current.getFullYear();
        const m = (current.getMonth() + 1).toString().padStart(2, '0');
        const d = current.getDate().toString().padStart(2, '0');
        dates.push(`${y}-${m}-${d}`);
        current.setDate(current.getDate() + 1);
    }

    return dates;
}
    async findAll(query: GetAppointmentsDto) {

        return this.stateValidator.findAppointments(query);

    }
    async findOne(id: string) {
        return this.validators.validateAppointment(id);
    }
    async cancel(id: string) {

        const appointment =
            await this.validators.validateAppointment(id);

        await this.stateValidator.validateTransition(
            appointment, AppointmentStatus.CANCELLED
        );

        return this.stateValidator.updateStatus(
            appointment, AppointmentStatus.CANCELLED
        );

    }
    async reschedule(id: string, dto: RescheduleAppointmentDto) {

        const appointment = await this.validators.validateAppointment(id);

        await this.stateValidator.validateCanReschedule(appointment);

        const doctor = await this.validators.validateDoctor(appointment.doctorId);

        const service = await this.validators.validateService(appointment.serviceId);

        await this.validators.validateDoctorBlock(doctor, dto.appointmentDate);

        await this.validators.validateHoliday(dto.appointmentDate);

        await this.validators.validateAvailability(doctor, service,
            { appointmentDate: dto.appointmentDate, appointmentTime: dto.appointmentTime });

        await this.validators.validateDoctorScheduleBlock(doctor, service,
            { appointmentDate: dto.appointmentDate, appointmentTime: dto.appointmentTime });

        await this.validators.validateAppointmentConflict(doctor, service,
            { appointmentDate: dto.appointmentDate, appointmentTime: dto.appointmentTime },
            appointment.id,
        );

        return this.validators.rescheduleAppointment(appointment, dto);

    }
    async confirm(id: string) {

        const appointment = await this.validators.validateAppointment(id);

        await this.stateValidator.validateTransition(appointment, AppointmentStatus.CONFIRMED);

        return this.stateValidator.updateStatus(appointment, AppointmentStatus.CONFIRMED);

    }
    async complete(id: string) {

        const appointment = await this.validators.validateAppointment(id);

        await this.stateValidator.validateTransition(appointment, AppointmentStatus.COMPLETED);

        return this.stateValidator.updateStatus(appointment, AppointmentStatus.COMPLETED);
    }

    async noShow(id: string) {

        const appointment = await this.validators.validateAppointment(id);

        await this.stateValidator.validateTransition(appointment, AppointmentStatus.NO_SHOW);

        return this.stateValidator.updateStatus(appointment, AppointmentStatus.NO_SHOW);

    }

}
