import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, IsUUID } from "class-validator";

export class ConfirmCardDto {
	@ApiProperty({ name: "client_id", example: "" })
	@IsUUID()
	public client_id!: string;

	@ApiProperty({ name: "transaction_id", example: "" })
	@IsNumber()
	public transaction_id!: number;

	@ApiProperty({ name: "otp", example: "" })
	@IsString()
	public otp!: string;
}
