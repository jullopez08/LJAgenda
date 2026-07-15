import { Doctor, Patient, Service } from '@prisma/client';

export interface AppointmentContext {

  doctor: Doctor;

  patient: Patient;

  service: Service;

  appointmentDate: Date;

  duration: number;

  slotGap: number;

  totalMinutes: number;

}