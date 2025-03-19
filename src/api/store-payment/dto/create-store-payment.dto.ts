import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { IsNotEmpty, IsNumber, IsUUID, Min } from "class-validator";
import { StorePaymentStatus } from "src/common/database/Enums";

export class CreateStorePaymentDto {
	@ApiProperty({
		name: "amount",
		example: 124232,
		description: "amount of store payment",
	})
	@IsNotEmpty()
	@IsNumber()
	@Min(1)
	public amount!: number;

	@ApiProperty({
		name: "status",
		example: StorePaymentStatus.UNPAID,
		description: "status of store payment",
	})
	public status!: StorePaymentStatus;

	@ApiProperty({
		name: "monthly_payment",
		example: 124232,
		description: "monthly_payment of store payment",
	})
	@Exclude()
	public monthly_payment!: number;

	@ApiProperty({
		name: "for_month",
		example: 124232,
		description: "for_month of store payment",
	})
	@IsNotEmpty()
	@IsNumber()
	public for_month!: number;

	@ApiProperty({
		name: "store_id",
		example: "473351d3-9b2c-49f6-98e7-52ac51b11596",
		description: "store id of store payment",
	})
	@IsNotEmpty()
	@IsUUID()
	public store_id!: string;
}
