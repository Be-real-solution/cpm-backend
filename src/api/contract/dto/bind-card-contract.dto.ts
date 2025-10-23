import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class BindCardToContractDto {
	@ApiProperty()
	@IsNotEmpty()
	public contract_id!: string;

	@ApiProperty()
	@IsNotEmpty()
	public card_id!: string;
}
