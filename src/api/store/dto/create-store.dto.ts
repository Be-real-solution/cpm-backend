import { ApiProperty } from "@nestjs/swagger";
import {
	IsNotEmpty,
	IsNumber,
	IsNumberString,
	IsString,
	Max,
	MaxLength,
	Min,
} from "class-validator";

export class CreateStoreDto {
	@ApiProperty({ name: "name", example: "Idea", description: "name of shop" })
	@IsNotEmpty()
	@IsString()
	public name!: string;

	@ApiProperty({
		name: "phone",
		example: "+998901234567",
		description: "phone number of shop",
	})
	@IsNotEmpty()
	@IsString()
	@MaxLength(20)
	public phone!: string;

	@ApiProperty({
		name: "address",
		example: "Toshkent Mirobod 75 uy",
		description: "address of shop",
	})
	@IsNotEmpty()
	@IsString()
	public address!: string;

	@ApiProperty({
		name: "region",
		example: "Toshkent",
		description: "region of store",
	})
	@IsNotEmpty()
	@IsString()
	public region!: string;

	@ApiProperty({
		name: "director",
		example: "Jalilov Qaxxor",
		description: "director of shop",
	})
	@IsNotEmpty()
	@IsString()
	@MaxLength(64)
	public director!: string;

	@ApiProperty({
		name: "manager",
		example: "Jalilov Qaxxor",
		description: "manager of shop",
	})
	@IsNotEmpty()
	@IsString()
	@MaxLength(64)
	public manager!: string;

	@ApiProperty({
		name: "username",
		example: "Idea123",
		description: "username of shop",
	})
	@IsNotEmpty()
	@IsString()
	@MaxLength(32)
	public username!: string;

	@ApiProperty({
		name: "password",
		example: "Idea123",
		description: "password of shop",
	})
	@IsNotEmpty()
	@IsString()
	public password!: string;

	@ApiProperty({
		name: "payment_day",
		example: 12,
		description: "payment day in the month of shop",
	})
	@IsNotEmpty()
	@IsNumber()
	@Max(28)
	@Min(1)
	public payment_day!: number;

	@ApiProperty({
		name: "monthly_payment",
		example: 170000,
		description: "monthly payment for a month of shop",
	})
	@IsNotEmpty()
	@IsNumber()
	@Min(0)
	public monthly_payment!: number;

	@ApiProperty({
		name: "responsible_person",
		example: "Jalilov Qaxxor",
		description: "responsible_person of shop",
	})
	@IsNotEmpty()
	@IsString()
	@MaxLength(64)
	public responsible_person!: string;

	@ApiProperty({
		name: "second_phone",
		example: "+998999007890",
		description: "second phone of shop",
	})
	@IsNotEmpty()
	@IsString()
	@MaxLength(20)
	public second_phone!: string;

	@ApiProperty({
		name: "bank_account_number",
		example: "7492384298",
		description: "bank account number of store",
	})
	@IsNotEmpty()
	@IsNumberString()
	public bank_account_number!: string;

	@ApiProperty({
		name: "bank_address",
		example: "Toshkent shahar",
		description: "bank address of store",
	})
	@IsNotEmpty()
	@IsString()
	public bank_address!: string;

	@ApiProperty({
		name: "mfo",
		example: "7492384298",
		description: "mfo of store",
	})
	@IsNotEmpty()
	@IsNumberString()
	public mfo!: string;

	@ApiProperty({
		name: "stir",
		example: "7492384298",
		description: "stir of store",
	})
	@IsNotEmpty()
	@IsNumberString()
	public stir!: string;
}
