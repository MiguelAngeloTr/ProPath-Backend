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
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  documentId: string;

  @IsEnum(IdType, { message: 'idType debe ser CC o CE' })
  idType: IdType;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsEnum(UserRole, { message: 'role debe ser P o A' })
  @Transform(({ value }) => value.toUpperCase()) 
  role: UserRole;

  @IsString()
  country: string;

  @IsString()
  city: string;

  @IsDateString()
  birthDate: string;

  @IsOptional()
  @IsString()
  profilePictureUrl?: string;
}
