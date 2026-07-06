import { IsEmail, IsOptional, IsString } from "class-validator";

export class UpdatePatientDto {
  @IsOptional()
    @IsString()
    name?: string;

  @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    notes?: string;
}