import { UserDto } from './users.dto';

export interface GroupDto {
    id?: string;
    name: string;
    description: string;
    users?: UserDto[];
}

export interface AddUser {
    userId: string;
    groupId: string;
    role: string;
}
