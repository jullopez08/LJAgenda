import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

@Injectable()
export class DoctorService {
    constructor( private prisma: PrismaService){}

    async create(createDoctorDto: CreateDoctorDto){
        return this.prisma.doctor.create({
            data: createDoctorDto
        })
    }

    async findAll(){
        return this.prisma.doctor.findMany({
            orderBy:{ createdAt: 'desc'}
        })
    }

    async findOne(id: string){
        const doctor = await this.prisma.doctor.findUnique({where:{id}})

        if(!doctor){
            throw new NotFoundException('Doctor no encontrado')
        }

        return doctor
    }

    async update(id: string, updateDoctorDto: UpdateDoctorDto){
        await this.findOne(id)

        return this.prisma.doctor.update({ where:{id}, data: updateDoctorDto})
    }

    async remove(id: string){
        await this.findOne(id)

        return this.prisma.doctor.delete({where:{id}})
    }
}
