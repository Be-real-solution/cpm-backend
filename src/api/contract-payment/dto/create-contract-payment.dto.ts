import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, IsUUID } from "class-validator";
import { ContractPaymentMethod } from "src/common/database/Enums";

export class CreateContractPaymentDto {
	@ApiProperty({
		name: "amount",
		example: 12323,
		description: "amount of contract payment",
	})
	@IsNotEmpty()
	@IsNumber()
	public amount!: number;

	@ApiProperty({
		name: "method",
		example: ContractPaymentMethod.BANK,
		examples: ContractPaymentMethod,
		description: "method of contract payment",
	})
	@IsNotEmpty()
	@IsEnum(ContractPaymentMethod)
	public method!: ContractPaymentMethod;

	@ApiProperty({
		name: "contract_id",
		example: "69350607-55a8-446c-b370-2aa11a958c5b",
		description: "id of contract",
	})
	@IsNotEmpty()
	@IsUUID()
	public contract_id!: string;

	@ApiProperty({
		name: "contract_payment_table_id",
		example: 1,
		description: "id of contract payment table",
	})
	@IsNotEmpty()
	@IsNumber()
	public contract_payment_table_id!: number;
}
