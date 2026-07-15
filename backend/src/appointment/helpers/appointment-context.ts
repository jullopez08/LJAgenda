import { Doctor, Patient, Service } from '@prisma/client';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';
import { AppointmentContext } from '../interfaces/appointment-context.interface';

export function buildAppointmentContext(
  doctor: Doctor,
  patient: Patient,
  service: Service,
  dto: CreateAppointmentDto,
): AppointmentContext{
  return {
    doctor,
    patient,
    service,

    appointmentDate: new Date(dto.appointmentDate),

    duration: service.duration,

    slotGap: doctor.slotGap,

    totalMinutes: service.duration + doctor.slotGap,
  };
}