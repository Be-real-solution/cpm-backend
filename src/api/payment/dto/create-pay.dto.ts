import { ApiProperty } from "@nestjs/swagger";

export class CreatePayDto {
	@ApiProperty()
	store_id!: string;
	@ApiProperty()
	amount!: number;
	@ApiProperty()
	client_id!: string;
	@ApiProperty()
	card_id!: string;
}
