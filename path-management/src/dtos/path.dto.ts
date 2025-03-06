import { ActivityDto } from './activity.dto';

export interface PathDto {
    id: string;
    name: string;
    description: string;
    state: string;
    totalHours: number;
    totalBudget: number;
    activities: ActivityDto[];
    userId: number;
}
