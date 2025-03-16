import { ActivityDto } from './activity.dto';

export interface PathDto {
    id: string;
    name: string;
    description: string;
    state: string;
    activities?: ActivityDto[];
    userId: string;
    coachId?: string;
}
