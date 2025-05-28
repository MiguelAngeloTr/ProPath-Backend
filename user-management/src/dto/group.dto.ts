import { IsNumber, IsOptional, IsString } from "class-validator";
import { User } from "../entities/user.entity";


export class GroupDto {
    @IsString()
    @IsOptional()
    id?: string;
    @IsString()
    name: string;
    @IsString()
    description: string;
}



