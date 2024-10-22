import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Roles } from "src/common/database/Enums";

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

	@ApiPropertyOptional({ name: "role", example: "admin", description: "role of admin defoult admin created" })
	@IsOptional()
	@IsEnum([Roles.SUPER_ADMIN, Roles.ADMIN])
	public role!: Roles;
}
