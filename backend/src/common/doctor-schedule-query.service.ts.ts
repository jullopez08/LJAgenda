import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { endOfDay, getWeekDay, startOfDay } from '../appointment/helpers/appointment-date';
import { CreateAppointmentDto } from '../appointment/dto/create-appointment.dto';

@Injectable()
export class DoctorScheduleQueryService {

  constructor(
    private readonly prisma: PrismaService,
  ) {}

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
   async validateDoctorBlock(
      doctor: any,
      dto: CreateAppointmentDto,
    ) {
  
      const date = new Date(dto.appointmentDate);
  
      const block = await this.prisma.doctorBlock.findFirst({
        where: {
          doctorId: doctor.id, startDate: { lte: endOfDay(date), },
  
          endDate: { gte: startOfDay(date), },
        },
      });
  
      if (block) {
        throw new BadRequestException(
          `El doctor no atiende. ${block.reason ?? ''}`,
        );
      }
  
      return true;
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
  

}