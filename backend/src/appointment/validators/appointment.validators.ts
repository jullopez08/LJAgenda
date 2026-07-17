import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { DoctorService } from '../../doctor/doctor.service';
import { PatientsService } from '../../patients/patients.service';
import { ServiceService } from '../../service/service.service';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';
import { addMinutes, hasTimeConflict, isTimeBetween, timeToMinutes } from '../helpers/appointment-time';
import { HolidayService } from '../../holiday/holiday.service';
import { DoctorScheduleQueryService } from '../../common/doctor-schedule-query.service';
import { PrismaService } from '../../prisma/prisma.service';
import { getAppointmentDuration } from '../helpers/appointment-slot';

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
  async validateDoctorBlock(
    doctor: any,
    appointmentDate: string
  ) {

    const block =
      await this.queryService.getDoctorBlock(
        doctor.id,
        appointmentDate,
      );

    if (block) {
      throw new BadRequestException(
        `El doctor no atiende. ${block.reason ?? ''}`,
      );
    }

    return true;
  }

  async validateHoliday(
    appointmentDate: string
  ) {
    await this.holidayService.isHoliday(appointmentDate)

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

    const appointmentDuration = getAppointmentDuration(
      service.duration,
      doctor.slotGap,
    );

    const appointmentEnd = addMinutes(
      appointmentStart,
      appointmentDuration,
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

    const appointmentDuration = getAppointmentDuration(
      service.duration,
      doctor.slotGap,
    );

    const appointmentEnd = addMinutes(
      appointmentStart,
      appointmentDuration,
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
const appointmentDuration = getAppointmentDuration(
  service.duration,
  doctor.slotGap,
);

const appointmentEnd = addMinutes(
  appointmentStart,
  appointmentDuration,
);

    const appointments =
      await this.queryService.getAppointments(
        doctor.id,
        dto.appointmentDate,
      );

    for (const appointment of appointments) {

      const currentStart = appointment.appointmentTime;
const currentDuration = getAppointmentDuration(
  appointment.service.duration,
  doctor.slotGap,
);

const currentEnd = addMinutes(
  currentStart,
  currentDuration,
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
  async validateAppointment(id: string) {

  const appointment =
    await this.queryService.getAppointmentById(id);

  if (!appointment) {
    throw new NotFoundException(
      'La cita no existe.',
    );
  }

  return appointment;
}
async validateAppointmentCanBeCancelled(appointment: any) {

  if (appointment.status === 'CANCELLED') {
    throw new BadRequestException(
      'La cita ya fue cancelada.',
    );
  }
  if (appointment.status === 'COMPLETED') {
  throw new BadRequestException(
    'No es posible cancelar una cita completada.',
  );
}if (appointment.status === 'NO_SHOW') {
  throw new BadRequestException(
    'No es posible cancelar una cita marcada como inasistencia.',
  );
}

  return true;
}
async cancelAppointment(appointment: any) {

  return this.prisma.appointment.update({

    where: {
      id: appointment.id,
    },

    data: {
      status: 'CANCELLED',
    },

    include: {
      doctor: true,
      patient: true,
      service: true,
    },

  });

}

}