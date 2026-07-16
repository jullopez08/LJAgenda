import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { DoctorService } from "../../doctor/doctor.service";
import { CreateDoctorScheduleBlockDto } from "../dto/create-doctor-schedule-block.dto";
import { endOfDay, getWeekDay, startOfDay } from "../../appointment/helpers/appointment-date";
import { addMinutes, hasTimeConflict, isTimeBetween, timeToMinutes } from "../../appointment/helpers/appointment-time";

@Injectable()
export class DoctorScheduleBlockValidator {
  constructor(private readonly prisma: PrismaService,
    private readonly doctorService: DoctorService,
  ) { }
  async validateTimeRange(dto: CreateDoctorScheduleBlockDto) {

    if (timeToMinutes(dto.startTime) >= timeToMinutes(dto.endTime)) {
      throw new BadRequestException(
        'La hora de inicio debe ser menor que la hora de fin.',
      );
    }

    return true;
  }
  async validateDoctor(doctorId: string) {
    return this.doctorService.findOne(doctorId);
  }

  async validateDoctorBlock(
    doctor: any,
    dto: CreateDoctorScheduleBlockDto,
  ) {

    const date = new Date(dto.date);

    const block = await this.prisma.doctorBlock.findFirst({
      where: {
        doctorId: doctor.id,
        startDate: {
          lte: endOfDay(date),
        },
        endDate: {
          gte: startOfDay(date),
        },
      },
    });

    if (block) {
      throw new BadRequestException(
        `El doctor no atiende. ${block.reason ?? ''}`,
      );
    }

    return true;
  }

  async validateAvailability(
    doctor: any,
    dto: CreateDoctorScheduleBlockDto,
  ) {

    const day = getWeekDay(dto.date);

    const availabilities =
      await this.prisma.doctorAvailability.findMany({
        where: {
          doctorId: doctor.id,
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

    const validAvailability = availabilities.find((availability) => {

      return (
        isTimeBetween(
          dto.startTime,
          availability.startTime,
          availability.endTime,
        ) &&
        timeToMinutes(dto.endTime) <=
        timeToMinutes(availability.endTime)
      );
    });

    if (!validAvailability) {

      const startsInsideSomeShift = availabilities.some((availability) =>
        isTimeBetween(
          dto.startTime,
          availability.startTime,
          availability.endTime,
        ),
      );

      if (startsInsideSomeShift) {
        throw new BadRequestException(
          'El bloqueo termina después del horario laboral.',
        );
      }

      throw new BadRequestException(
        'El bloqueo inicia fuera del horario laboral.',
      );
    }

    return validAvailability;
  }
  async validateScheduleConflict(
    doctor: any,
    dto: CreateDoctorScheduleBlockDto,
  ) {

    const blocks =
      await this.prisma.doctorScheduleBlock.findMany({

        where: {
          doctorId: doctor.id,
          date: new Date(dto.date),
        },

      });

    for (const block of blocks) {

      const overlap = hasTimeConflict(
        dto.startTime,
        dto.endTime,
        block.startTime,
        block.endTime,
      );

      if (overlap) {
        throw new BadRequestException(
          'Ya existe un bloqueo en ese horario.',
        );
      }
    }

    return true;
  }

  async validateAppointmentConflict(
    doctor: any,
    dto: CreateDoctorScheduleBlockDto,
  ) {

    const appointments =
      await this.prisma.appointment.findMany({

        where: {
          doctorId: doctor.id,
          status: {
            not: "CANCELLED",
          },

          appointmentDate: {
            gte: startOfDay(new Date(dto.date)),
            lt: endOfDay(new Date(dto.date)),
          },
        },
        include: { service: true },

      });

    for (const appointment of appointments) {

      const currentStart = appointment.appointmentTime;

      const currentEnd = addMinutes(
        currentStart,
        appointment.service.duration + doctor.slotGap
      )

      const overlap = hasTimeConflict(
        dto.startTime,
        dto.endTime,
        currentStart,
        currentEnd,
      );

      if (overlap) {
        throw new BadRequestException(
          "Ya existen citas programadas en ese horario.",
        );
      }
    }

    return true;
  }



}