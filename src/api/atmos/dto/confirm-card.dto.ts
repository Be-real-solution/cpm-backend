import { ApiProperty } from "@nestjs/swagger";

export class ConfirmCardDto {
	@ApiProperty({ example: 1 })
	public transactionId!: number;

	@ApiProperty({ example: "123456" })
	public otp!: string;
}
