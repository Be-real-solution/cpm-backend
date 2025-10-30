import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class ConfirmCardDto {
	@ApiProperty({ example: 1 })
	@IsNotEmpty()
	public transactionId!: number;

	@ApiProperty({ example: "123456" })
	@IsNotEmpty()
	public otp!: string;
}
