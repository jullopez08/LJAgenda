import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDoctorScheduleBlockDto } from './dto/create-doctor-schedule-block.dto';
import { UpdateDoctorScheduleBlockDto } from './dto/update-doctor-schedule-block.dto';
import { PrismaService } from '../prisma/prisma.service';
import { DoctorScheduleBlockValidator } from './validators/doctor-schedule-block.validator';

@Injectable()
export class DoctorScheduleBlockService {

  constructor( private readonly prisma: PrismaService,
    private readonly validator: DoctorScheduleBlockValidator
  ){}

  async create(dto: CreateDoctorScheduleBlockDto) {
    await this.validator.validateTimeRange(dto);

    const doctor = await this.validator.validateDoctor(dto.doctorId);

    await this.validator.validateDoctorBlock(doctor, dto);
    
    await this.validator.validateAvailability(doctor, dto);

    await this.validator.validateScheduleConflict(doctor, dto);

    await this.validator.validateAppointmentConflict(doctor, dto);

    return this.prisma.doctorScheduleBlock.create({
      data: {doctorId: dto.doctorId,
        date: new Date(dto.date),
        startTime: dto.startTime,
        endTime: dto.endTime,
        reason: dto.reason,
      },
    });
  }

  async findAll() {
    return this.prisma.doctorScheduleBlock.findMany({
      include:{ doctor: true}, orderBy: {date: 'desc'}
    });
  }

  async findOne(id: string) {
    const blockSchedule = await this.prisma.doctorScheduleBlock.findUnique({
      where:{id}, include:{ doctor: true}
    })

    if(!blockSchedule){
      throw new NotFoundException('Bloque no encontrado')
    }
    return blockSchedule
  }

  async update(id: string, dtoUpdate: UpdateDoctorScheduleBlockDto) {
    await this.findOne(id)

    return this.prisma.doctorScheduleBlock.update({
      where: { id},
      data: {
        ...dtoUpdate, 
        ...(dtoUpdate.date && {
        date: new Date(dtoUpdate.date)
      })}
    })
  }

   async remove(id: string) {
    await this.findOne(id);

    return this.prisma.doctorScheduleBlock.delete({
      where: { id },
    });
  }
}
