import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class LoginDto {
	@ApiProperty({ name: "username", example: "akmal123", description: "username of admin" })
	@IsNotEmpty()
	@IsString()
	@MaxLength(20)
	public username!: string;

	@ApiProperty({ name: "password", example: "12345", description: "password of admin" })
	@IsNotEmpty()
	@IsString()
	public password!: string;
}
