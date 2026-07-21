import { IsNumber, IsOptional, IsString, Min } from "class-validator";

export class ServiceCardDto {
@IsString()
  id!: string;

  @IsString()
  name!: string;
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  basePrice?: number;
}