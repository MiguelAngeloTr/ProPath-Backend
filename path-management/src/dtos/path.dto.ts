import { IsString, IsUUID, IsNotEmpty, IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ActivityDto } from './activity.dto';
import { CommentDto } from './comment.dto';

enum PathState {
    INICIAL_RECHAZADO = 'R',
    REVISION_MENTOR = 'M',
    ACEPTADO_REVISION_ADMIN = 'A',
    ACTIVO_EN_CURSO = 'E'
}

export class PathDto {
    @IsOptional()
    @IsUUID()
    id?: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => ActivityDto)
    activities?: ActivityDto[];

    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsOptional()
    @IsString()
    coachId?: string;

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CommentDto)
    comments?: CommentDto[];

    constructor(partial: Partial<PathDto>) {
        Object.assign(this, partial);
    }
}

export class UpdatePathDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

}