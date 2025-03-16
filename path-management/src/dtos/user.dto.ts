import { PathDto } from './path.dto';

export interface UserInfo {
    id: number;
    idType: string;
    name: string;
    email: string;
    role: string;
    country: string;
    city: string;
    birthDate: string;
    profilePictureUrl?: string;
}

export interface UserWithPathsDto extends UserInfo {
    paths?: PathDto[];
}
