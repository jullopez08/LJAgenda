import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateDoctorDto {

  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  password!: string;

  @IsOptional()
  @IsString()
  clinicName?: string;
}