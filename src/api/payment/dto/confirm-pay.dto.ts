import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class ConfirmPayDto {
	@ApiProperty()
	@IsNotEmpty()
	card_token!: string;

	@ApiProperty()
	@IsNotEmpty()
	store_id!: string;

	@ApiProperty()
	@IsNotEmpty()
	transaction_id!: string;
}