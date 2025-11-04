import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class BindCardAtmosDto {
	@ApiProperty({ example: "123456789012" })
	@IsString()
	card_number!: string;

	@ApiProperty({ example: "12/25" })
	@IsString()
	expire!: string;
}
