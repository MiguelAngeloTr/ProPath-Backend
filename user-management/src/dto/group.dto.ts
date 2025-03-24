import { IsNumber, IsString } from "class-validator";
import { User } from "../entities/user.entity";


export class GroupDto {
    @IsString()
    id : string;
    @IsString()
    name: string;
    @IsString()
    description: string;
    users: User[];
}



