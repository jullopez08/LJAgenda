import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDoctorBlockDto } from './dto/create-doctor-block.dto';
import { UpdateDoctorBlockDto } from './dto/update-doctor-block.dto';
import { validateAndConvertIsoDates, validateAndConvertUpdateDates } from '../appointment/helpers/appointment-date';

@Injectable()
export class DoctorBlockService {

  constructor(
    private prisma: PrismaService,
  ) {}

  async create(createDoctorBlockDto: CreateDoctorBlockDto) {
    const {startDate, endDate} = validateAndConvertIsoDates( 
    createDoctorBlockDto.startDate, 
    createDoctorBlockDto.endDate)
    return this.prisma.doctorBlock.create({
      data: {
    ...createDoctorBlockDto,
    startDate,
    endDate
}
    });
  }

  async findAll() {
    return this.prisma.doctorBlock.findMany({
      include: {
        doctor: true,
      },
      orderBy: {
        startDate: 'desc',
      },
    });
  }

  async findOne(id: string) {

    const block = await this.prisma.doctorBlock.findUnique({
      where: { id },
      include: {
        doctor: true,
      },
    });

    if (!block) {
      throw new NotFoundException('Bloque no encontrado');
    }

    return block;
  }

 async update(id: string, updateDoctorBlockDto: UpdateDoctorBlockDto) {
    await this.findOne(id);

    const cleanUpdateData = validateAndConvertUpdateDates(updateDoctorBlockDto);

    return this.prisma.doctorBlock.update({
      where: { id },
      data: cleanUpdateData,
    });
  }

  async remove(id: string) {

    await this.findOne(id);

    return this.prisma.doctorBlock.delete({
      where: { id },
    });
  }
}