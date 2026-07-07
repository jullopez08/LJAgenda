import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDoctorAvailabilityDto } from './dto/create-doctor-availability.dto';
import { UpdateDoctorAvailabilityDto } from './dto/update-doctor-availability.dto';

@Injectable()
export class DoctorAvailabilityService {
    constructor(
        private prisma: PrismaService,
    ){}

    async create(CreateDoctorAvailabilityDto: CreateDoctorAvailabilityDto){
        return await this.prisma.doctorAvailability.create({
            data: CreateDoctorAvailabilityDto
        })
    }
    async findAll(){
        return this.prisma.doctorAvailability.findMany({
            orderBy: {createdAt: 'desc'}
        })
    }

    async findOne(id: string){
        const doctorAvailability = await this.prisma.doctorAvailability.findUnique({
            where:{id}
        })

        if(!doctorAvailability){
            throw new NotFoundException('')
        }

        return doctorAvailability
    }

    async update(id: string, updateDoctorAvailabilityDto: UpdateDoctorAvailabilityDto){
        await this.findOne(id)

        return this.prisma.doctorAvailability.update({
            where:{id}, data: updateDoctorAvailabilityDto
        })
    }

    async remove(id: string){
        await this.findOne(id)

        return this.prisma.doctorAvailability.delete({
            where:{id}
        })
    }
}
