import { CommentDto } from './comment.dto';

export interface ActivityDto {
    id: string;
    name: string;
    description: string;
    hours: number;
    initialDate: Date;
    finalDate: Date;
    budget: number;
    state: string;
    pathId: string;
    comments?: CommentDto[];
}
