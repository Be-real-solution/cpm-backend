import { ApiProperty } from "@nestjs/swagger";

export class ConfirmPayDto {
	@ApiProperty()
	card_token!: string;
	@ApiProperty()
	store_id!: string;
	@ApiProperty()
	transaction_id!: string;
}