import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class ApplyPayDto {
	@ApiProperty()
	@IsNotEmpty()
	public transaction_id!: number;

	@ApiProperty()
	@IsNotEmpty()
	public otp!: number;

	@ApiProperty()
	@IsNotEmpty()
	public store_id!: string;
}
