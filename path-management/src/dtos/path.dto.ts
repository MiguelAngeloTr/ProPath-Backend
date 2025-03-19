import { ActivityDto } from './activity.dto';
import { CommentDto } from './comment.dto';

export interface PathDto {
    id: string;
    name: string;
    description: string;
    state: string;
    activities?: ActivityDto[];
    userId: string;
    coachId?: string;
    comments?: CommentDto[];
}
