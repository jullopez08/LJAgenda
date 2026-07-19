import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { AppointmentStatus } from "@prisma/client";

@Injectable()

export class StatusValidators {
  constructor(
    private readonly prisma: PrismaService,
  ) { }
  private readonly transitions: Record<AppointmentStatus, AppointmentStatus[]> = {

    SCHEDULED: [
      AppointmentStatus.CONFIRMED,
      AppointmentStatus.COMPLETED,
      AppointmentStatus.NO_SHOW,
      AppointmentStatus.CANCELLED,
    ],

    CONFIRMED: [
      AppointmentStatus.COMPLETED,
      AppointmentStatus.NO_SHOW,
      AppointmentStatus.CANCELLED,
    ],

    COMPLETED: [],

    CANCELLED: [],

    NO_SHOW: [],

  };

  validateTransition(appointment: any, nextStatus: AppointmentStatus) {
    const allowed = this.transitions[appointment.status];

    if (!allowed.includes(nextStatus)) {

      throw new BadRequestException(
        `No es posible cambiar una cita de ${appointment.status} a ${nextStatus}.`,
      );
    } return true;
  }
  updateStatus(appointment: any, nextStatus: AppointmentStatus) {
    const data: any = { status: nextStatus };

    if (nextStatus === AppointmentStatus.CONFIRMED) {
      data.confirmedAt = new Date();
    }

    return this.prisma.appointment.update({
      where: { id: appointment.id },

      data,

      include: { doctor: true, patient: true, service: true }
    });

  }
  validateCanReschedule(appointment: any) {

    const invalidStates = [
      AppointmentStatus.CANCELLED,
      AppointmentStatus.COMPLETED,
      AppointmentStatus.NO_SHOW,
    ];

    if (invalidStates.includes(appointment.status)) {

      throw new BadRequestException(
        'No es posible reprogramar esta cita.',
      );
    }
  }
} 
