import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DoctorService {
    constructor( private prisma: PrismaService){}

    async create(createDoctorDto: CreateDoctorDto) {
        try{
        const hashedPassword = await bcrypt.hash(createDoctorDto.password, 10);

    return this.prisma.doctor.create({
        data: {...createDoctorDto, password: hashedPassword},
    })} catch (error: any){
         if (error.code === 'P2002') {
                throw new ConflictException('El correo electrónico ya se encuentra registrado.');
            }
            throw error;
    }

    
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

    async update(id: string, updateDoctorDto: UpdateDoctorDto) {

    await this.findOne(id);

    if (updateDoctorDto.password) {
        updateDoctorDto.password = await bcrypt.hash(updateDoctorDto.password, 10);
    }

    return this.prisma.doctor.update({where: { id }, data: updateDoctorDto});
}

    async remove(id: string){
        await this.findOne(id)

        await this.prisma.doctorAvailability.deleteMany({where:{id}})

        return this.prisma.doctor.delete({where: {id}})

    }
}
