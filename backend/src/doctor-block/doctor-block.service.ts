import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDoctorBlockDto } from './dto/create-doctor-block.dto';
import { UpdateDoctorBlockDto } from './dto/update-doctor-block.dto';

@Injectable()
export class DoctorBlockService {

  constructor(
    private prisma: PrismaService,
  ) {}

  async create(createDoctorBlockDto: CreateDoctorBlockDto) {
    return this.prisma.doctorBlock.create({
      data: createDoctorBlockDto,
    });
  }

  async findAll() {
    return this.prisma.doctorBlock.findMany({
      include: {
        doctor: true,
      },
      orderBy: {
        date: 'asc',
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

  async update(
    id: string,
    updateDoctorBlockDto: UpdateDoctorBlockDto,
  ) {

    await this.findOne(id);

    return this.prisma.doctorBlock.update({
      where: { id },
      data: updateDoctorBlockDto,
    });
  }

  async remove(id: string) {

    await this.findOne(id);

    return this.prisma.doctorBlock.delete({
      where: { id },
    });
  }
}