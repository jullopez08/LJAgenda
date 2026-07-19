import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { AppointmentStatus } from "@prisma/client";
import { GetAppointmentsDto } from "../dto/get-appointments.dto";

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
  async findAppointments(
    query: GetAppointmentsDto,
) {

    const where: any = {};

    if (query.doctorId) {
        where.doctorId = query.doctorId;
    }

    if (query.patientId) {
        where.patientId = query.patientId;
    }

    if (query.status) {
        where.status = query.status;
    }

    if (query.date) {

        where.appointmentDate = {

            gte: new Date(`${query.date}T00:00:00`),

            lte: new Date(`${query.date}T23:59:59.999`),

        };

    }

    return this.prisma.appointment.findMany({

        where,

        include: {
            doctor: true,
            patient: true,
            service: true,
        },

        orderBy: [
            {
                appointmentDate: 'asc',
            },
            {
                appointmentTime: 'asc',
            },
        ],

    });

}
} 
