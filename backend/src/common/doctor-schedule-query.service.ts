import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { endOfDay, getWeekDay, startOfDay } from '../appointment/helpers/appointment-date';

@Injectable()
export class DoctorScheduleQueryService {

  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async getDoctorAvailabilities(
    doctorId: string,
    appointmentDate: string,
  ) {

    const day = getWeekDay(appointmentDate);

    const availabilities =
      await this.prisma.doctorAvailability.findMany({
        where: {
          doctorId,
          day,
        },
        orderBy: {
          startTime: 'asc',
        },
      });

    if (!availabilities.length) {
      throw new BadRequestException(
        'El doctor no trabaja este día.',
      );
    }

    return availabilities;
  }

  async getDoctorScheduleBlocks(
    doctorId: string,
    appointmentDate: string,
  ) {

    return this.prisma.doctorScheduleBlock.findMany({
      where: {
        doctorId,
        date: {
          gte: startOfDay(new Date(appointmentDate)),
          lt: endOfDay(new Date(appointmentDate)),
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });

  }

  async getAppointments(
    doctorId: string,
    appointmentDate: string,
  ) {

    return this.prisma.appointment.findMany({
      where: {
        doctorId,
        status: {
          not: 'CANCELLED',
        },
        appointmentDate: {
          gte: startOfDay(new Date(appointmentDate)),
          lt: endOfDay(new Date(appointmentDate)),
        },
      },
      include: {
        service: true,
      },
      orderBy: {
        appointmentTime: 'asc',
      },
    });

  }
 
  async getDoctorBlock(
    doctorId: string,
    appointmentDate: string,
  ) {

    const date = new Date(appointmentDate);

    return this.prisma.doctorBlock.findFirst({
      where: {
        doctorId,
        startDate: {
          lte: endOfDay(date),
        },
        endDate: {
          gte: startOfDay(date),
        },
      },
    });

  }
  async getAppointmentById(id: string) {

  return this.prisma.appointment.findUnique({
    where: {
      id,
    },
    include: {
      doctor: true,
      patient: true,
      service: true,
    },
  });

}


}