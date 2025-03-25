import { IsString, IsEmail, IsOptional, IsDateString, Length, IsEnum } from 'class-validator';

import { Transform } from 'class-transformer';

export enum IdType {
  CC = 'CC', // Cédula de Ciudadanía
  CE = 'CE', // Cédula de Extranjería
}

export enum UserRole {
  P = 'P', // Profesional
  A = 'A', // Administrador
}

export class UserDto {
  @IsString()
  @Length(1, 50)
  id: string;

  @IsEnum(IdType, { message: 'idType debe ser CC o CE' })
  idType: IdType;

  @IsString()
  @Length(1, 50)
  name: string;

  @IsEmail()
  @Length(1, 30)
  email: string;

  @IsEnum(UserRole, { message: 'role debe ser P o A' })
  @Transform(({ value }) => value.toUpperCase()) // 👈 Transforma a mayúsculas antes de validar
  role: UserRole;

  @IsString()
  @Length(1, 50)
  country: string;

  @IsString()
  @Length(1, 50)
  city: string;

  @IsDateString()
  birthDate: string;

  @IsOptional()
  @IsString()
  @Length(0, 200)
  profilePictureUrl?: string;
}
