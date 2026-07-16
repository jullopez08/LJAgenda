import { Injectable, BadRequestException } from '@nestjs/common';
import { DoctorService } from '../../doctor/doctor.service';
import { PatientsService } from '../../patients/patients.service';
import { ServiceService } from '../../service/service.service';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';

import { addMinutes, hasTimeConflict, isTimeBetween, timeToMinutes } from '../helpers/appointment-time';
import { endOfDay, startOfDay, getWeekDay } from '../helpers/appointment-date';
import { HolidayService } from '../../holiday/holiday.service';
import { DoctorScheduleQueryService } from '../../common/doctor-schedule-query.service.ts';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AppointmentValidators {

  constructor(
  private readonly doctorService: DoctorService,
  private readonly patientService: PatientsService,
  private readonly serviceService: ServiceService,
  private readonly holidayService: HolidayService,
  private readonly queryService: DoctorScheduleQueryService,
  private readonly prisma: PrismaService,
  ) { }

  async validateDoctor(doctorId: string) {
    return this.doctorService.findOne(doctorId);
  }

  async validatePatient(patientId: string) {
    return this.patientService.findOne(patientId);
  }

  async validateService(serviceId: string) {
    const service = await this.serviceService.findOne(serviceId);

    if (!service.active) {
      throw new BadRequestException('El servicio no está disponible.')
    }
    return service
  }

 
  async validateHoliday(
    dto: CreateAppointmentDto,
  ) {
    await this.holidayService.isHoliday(dto.appointmentDate)

  }
 
  async validateAvailability(
    doctor: any,
    service: any,
    dto: CreateAppointmentDto,
  ) {

    const availabilities =
   await this.queryService.getDoctorAvailabilities(
    doctor.id,
    dto.appointmentDate,
);

    const appointmentStart = dto.appointmentTime;

    const appointmentEnd = addMinutes(
      appointmentStart,
      service.duration + doctor.slotGap,
    );

    const validAvailability = availabilities.find((availability) => {

      return (
        isTimeBetween(
          appointmentStart,
          availability.startTime,
          availability.endTime,
        ) &&
        timeToMinutes(appointmentEnd) <=
        timeToMinutes(availability.endTime)
      );
    });

    if (!validAvailability) {

      const startsInsideSomeShift = availabilities.some((availability) =>
        isTimeBetween(
          appointmentStart,
          availability.startTime,
          availability.endTime,
        ),
      );

      if (startsInsideSomeShift) {
        throw new BadRequestException(
          'La cita termina después del horario laboral.',
        );
      }

      throw new BadRequestException(
        'La cita inicia fuera del horario laboral.',
      );
    }

    return validAvailability;
  }
 
  async validateDoctorScheduleBlock(
    doctor: any,
    service: any,
    dto: CreateAppointmentDto,
  ) {

    const appointmentStart = dto.appointmentTime;

    const appointmentEnd = addMinutes(
      appointmentStart,
      service.duration + doctor.slotGap,
    );

    const blocks =
await this.queryService.getDoctorScheduleBlocks(
    doctor.id,
    dto.appointmentDate,
);

    for (const block of blocks) {

      const overlap = hasTimeConflict(
        appointmentStart,
        appointmentEnd,
        block.startTime,
        block.endTime,
      );

      if (overlap) {
        throw new BadRequestException(
          `El doctor tiene bloqueado ese horario. ${block.reason ?? ''}`,
        );
      }
    }

    return true;
  }
 

  async validateAppointmentConflict(
    doctor: any,
    service: any,
    dto: CreateAppointmentDto,
  ) {

    const appointmentStart = dto.appointmentTime;

    const appointmentEnd = addMinutes(
      appointmentStart,
      service.duration + doctor.slotGap,
    );

   const appointments =
await this.queryService.getAppointments(
    doctor.id,
    dto.appointmentDate,
);

    for (const appointment of appointments) {

      const currentStart = appointment.appointmentTime;

      const currentEnd = addMinutes(
        currentStart,
        appointment.service.duration + doctor.slotGap,
      );

      const overlap = hasTimeConflict(
        appointmentStart,
        appointmentEnd,
        currentStart,
        currentEnd,
      );

      if (overlap) {
        throw new BadRequestException(
          'Ya existe una cita en ese horario.',
        );
      }
    }

    return true;
  }

  async saveAppointment(dto: CreateAppointmentDto) {

    const appointmentDate = new Date(`${dto.appointmentDate}T${dto.appointmentTime}:00`)
    return this.prisma.appointment.create({
      data: {
        appointmentDate,
        appointmentTime: dto.appointmentTime,
        observations: dto.observations,
        patientId: dto.patientId,
        doctorId: dto.doctorId,
        serviceId: dto.serviceId,

      },
      include: {
        doctor: true,
        patient: true,
        service: true,
      }
    })
  }
}