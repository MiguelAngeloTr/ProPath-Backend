import { IsString, IsUUID, IsNotEmpty, IsDate, IsNumber, Min, Max, IsEnum, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { CommentDto } from './comment.dto';
import { IsDateAfter } from './validators/activity.validator';

enum ActivityState {
    EN_CURSO = 'E',
    PENDIENTE = 'P',
    COMPLETADO = 'C'
}

export class ActivityDto {
    @IsOptional()
    @IsUUID()
    id?: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @Min(0)
    @Max(32, { message: 'Las horas de una actividad no pueden exceder 32' })
    hours: number;

    @IsDate()
    @Type(() => Date)
    initialDate: Date;

    @IsDate()
    @Type(() => Date)
    @IsDateAfter('initialDate', { 
        message: 'La fecha final debe ser igual o posterior a la fecha inicial' 
    })
    finalDate: Date;

    @IsNumber()
    @Min(0)
    budget: number;

    @IsEnum(ActivityState, { 
        message: 'El estado debe ser: E (En curso), P (Pendiente) o C (Completado)' 
    })
    state: string;

    @IsUUID()
    pathId: string;

    @IsOptional()
    comments?: CommentDto[];

    constructor(partial: Partial<ActivityDto>) {
        Object.assign(this, partial);
    }
}