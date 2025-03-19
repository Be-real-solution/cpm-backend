import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	IsArray,
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsNumberString,
	IsString,
	IsUUID,
	MaxLength,
	Min,
	ValidateNested,
} from "class-validator";
import {
	ContractInitialPaymentType,
	ContractProductUnit,
	ContractStatus,
} from "src/common/database/Enums";

export class CreateContractProductDto {
	public id!: string;

	@ApiProperty({
		name: "name",
		example: "Xolodelnik",
		description: "name of contract product",
	})
	@IsNotEmpty()
	@IsString()
	public name!: string;

	@ApiProperty({
		name: "unit",
		example: "pcs",
		examples: ContractProductUnit,
		description: "unit of contract product",
	})
	@IsNotEmpty()
	@IsEnum(ContractProductUnit)
	public unit!: ContractProductUnit;

	@ApiProperty({
		name: "quantity",
		example: 6,
		description: "quantity of contract product",
	})
	@IsNotEmpty()
	@IsNumber()
	@Min(1)
	public quantity!: number;

	@ApiProperty({
		name: "price",
		example: 60000,
		description: "price of contract product",
	})
	@IsNotEmpty()
	@IsNumber()
	@Min(0)
	public price!: number;
}

export class CreateContractDto {
	@ApiProperty({
		name: "inn",
		example: "5468713",
		description: "inn of contract, max lenght 16",
	})
	@IsNotEmpty()
	@IsNumberString()
	@MaxLength(16)
	public inn!: string;

	@ApiProperty({
		name: "initial_payment_percent",
		example: 30,
		description: "initial_payment_type of contract",
	})
	@IsNotEmpty()
	@IsNumber()
	public initial_payment_percent!: number;

	@ApiProperty({
		name: "initial_payment_amount",
		example: 100000,
		description: "initial_payment_amount of contract",
	})
	@IsNotEmpty()
	@IsNumber()
	public initial_payment_amount!: number;

	@ApiProperty({
		name: "start_date",
		example: 1827378222,
		description: "start date of contract",
	})
	@IsNotEmpty()
	@IsNumber()
	public start_date!: number;

	@ApiProperty({
		name: "unpaid_month",
		example: 6,
		description: "unpaid month of contract",
	})
	@IsNotEmpty()
	@IsNumber()
	public unpaid_month!: number;

	@ApiProperty({
		name: "total_amount",
		example: 6,
		description: "total amount of contract",
	})
	@IsNotEmpty()
	@IsNumber()
	public total_amount!: number;

	@ApiProperty({
		name: "client",
		example: "a6tbd7wo9nqm2djuabclpa90",
		description: "client id",
	})
	@IsNotEmpty()
	@IsUUID()
	public client!: string;

	@ApiProperty({
		name: "contract_product",
		type: [CreateContractProductDto],
		examples: CreateContractProductDto,
		description: "contract product ",
	})
	@IsNotEmpty()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateContractProductDto)
	public contract_product!: CreateContractProductDto[];
}
