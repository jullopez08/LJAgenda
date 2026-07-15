import { IsEmail, IsInt, IsOptional, IsString, Min } from 'class-validator';

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

  @IsOptional()
  @IsInt()
  @Min(0)
  slotGap?: number;
}