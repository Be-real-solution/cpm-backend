import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateAdminDto {
	@ApiProperty({ name: "fullname", example: "Akmal", description: "fullname of admin" })
	@IsNotEmpty()
	@IsString()
	public fullname!: string;

	@ApiProperty({ name: "username", example: "akmal123", description: "username of admin" })
	@IsNotEmpty()
	@IsString()
	public username!: string;

	@ApiProperty({
		name: "phone_number",
		example: "+998999002559",
		description: "phone number of admin",
	})
	@IsNotEmpty()
	@IsString()
	public phone_number!: string;

	@ApiProperty({ name: "password", example: "12345", description: "password of admin" })
	@IsNotEmpty()
	@IsString()
	public password!: string;
}
