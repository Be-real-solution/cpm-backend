import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID } from "class-validator";

export class BindCardDto {
	@ApiProperty({ name: "client_id", example: "" })
	@IsUUID()
	client_id!: string;

	@ApiProperty({ example: "123456789012" })
	@IsString()
	card_number!: string;

	@ApiProperty({ example: "12/25" })
	@IsString()
	expire!: string;
}
