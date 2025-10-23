import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class BindCardDto {
	@ApiProperty({ example: "123456789012" })
	@IsString()
	public card_number!: string;

	@ApiProperty({ example: "12/25" })
	@IsString()
	public expire!: string;
}
