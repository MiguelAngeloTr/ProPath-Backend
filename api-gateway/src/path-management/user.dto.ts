import { PathDto } from "./path.dto";

export interface UserDto {
    id: number;
    idType: string;
    name: string;
    email: string;
    role: string;
    country: string;
    city: string;
    birthDate: string;
    profilePictureUrl?: string;
    paths?: PathDto[];
}