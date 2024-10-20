import { IsNotEmpty, IsNumber, IsUUID } from "class-validator";
import { Roles } from "../database/Enums";
import { type } from "os";
import { ApiProperty } from "@nestjs/swagger";

export class ObjDto {
	@IsNotEmpty()
	@IsUUID()
	id!: string;
}

export interface IResponse<T> {
	status_code: number;
	data: T;
	message: string;
}

export interface AuthPayload {
	id: string;
	role: Roles;
	phone_number: string
}

export class response_data<T> {
	@ApiProperty({ example: 200 })
	status_code!: number;

	@ApiProperty({ example: "Success" })
	message!: string;

	@ApiProperty()
	data!: T;
};
