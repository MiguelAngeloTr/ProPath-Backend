import { IsString, IsUUID, IsNotEmpty, IsDate, ValidateIf, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CommentDto {
    @IsOptional()
    @IsUUID()
    id?: string;

    @IsString()
    @IsNotEmpty()
    authorId: string;

    @IsString()
    @IsNotEmpty()
    authorName: string;

    @IsString()
    @IsNotEmpty()
    message: string;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    date?: Date;

    @ValidateIf(o => !o.pathId)
    @IsUUID()
    activityId?: string;

    @ValidateIf(o => !o.activityId)
    @IsUUID()
    pathId?: string;

    constructor(partial: Partial<CommentDto>) {
        Object.assign(this, partial);
    }
}