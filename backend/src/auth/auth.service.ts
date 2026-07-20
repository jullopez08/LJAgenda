import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Doctor } from '@prisma/client';

@Injectable()
export class AuthService {
     constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {

    const doctor = await this.validateDoctor(loginDto.email, loginDto.password);

    const accessToken = await this.generateAccessToken(doctor);

    const doctorWithoutPassword = this.sanitizeDoctor(doctor);

    return { accessToken, doctor: doctorWithoutPassword};
  }

  private async validateDoctor(email: string, password: string): Promise<Doctor> {

    const doctor = await this.prisma.doctor.findUnique({where: { email }});

    if (!doctor) {
      throw new UnauthorizedException('Credenciales incorrectas')}

    const passwordMatch = await bcrypt.compare(password, doctor.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    return doctor;
  }

  private async generateAccessToken(doctor: Doctor): Promise<string> {

    const payload = {sub: doctor.id};

    return this.jwtService.signAsync(payload);
  }

  private sanitizeDoctor(doctor: Doctor) {

    const { password, ...doctorWithoutPassword } = doctor;

    return doctorWithoutPassword;
  }

}
