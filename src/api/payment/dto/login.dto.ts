import { IsOptional, IsString } from "class-validator";

export class PaymentLoginDto {
    @IsString()
    url!: string;
    @IsOptional()
    body?: any;
    @IsOptional()
    headers?: any
    @IsString()
    method!: string
}
