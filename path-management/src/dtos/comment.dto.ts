import { IsString, IsUUID, IsNotEmpty, IsDate, ValidateIf, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { EitherActivityIdOrPathId } from './validators/comment.validator';

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

    @IsOptional()
    @IsUUID()
    @EitherActivityIdOrPathId()
    activityId?: string;

    @IsOptional()
    @IsUUID()
    pathId?: string;

    constructor(partial: Partial<CommentDto>) {
        Object.assign(this, partial);
    }
}