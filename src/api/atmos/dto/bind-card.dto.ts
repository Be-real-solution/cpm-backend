import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class BindCardDto {
	@ApiProperty({ example: "123456789012" })
	@IsString()
	cardNumber!: string;

	@ApiProperty({ example: "12/25" })
	@IsString()
	expire!: string;
}
