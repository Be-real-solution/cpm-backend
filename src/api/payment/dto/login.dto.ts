import { IsOptional, IsString } from "class-validator";

export class LoginDto {
    @IsString()
    url!: string;
    @IsOptional()
    body?: any;
    @IsOptional()
    headers?: any
    @IsString()
    method!: string
}
