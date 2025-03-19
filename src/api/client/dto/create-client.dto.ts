import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsNumberString, IsString, MaxLength } from "class-validator";

export class CreateClientDto {
	@ApiProperty({
		name: "first_name",
		example: "Baxrom",
		description: "firstname of client, max 64 lenth",
	})
	@IsNotEmpty()
	@IsString()
	@MaxLength(64)
	public first_name!: string;

	@ApiProperty({
		name: "last_name",
		example: "Kamalov",
		description: "lastname of client, max 64 lenth",
	})
	@IsNotEmpty()
	@IsString()
	@MaxLength(64)
	public last_name!: string;

	@ApiProperty({
		name: "second_name",
		example: "Alisherovich",
		description: "secondname of client, max 64 lenth",
	})
	@IsNotEmpty()
	@IsString()
	@MaxLength(64)
	public second_name!: string;

	@ApiProperty({
		name: "passport",
		example: "AB5896347",
		description: "passport of client, max 16 lenth",
	})
	@IsNotEmpty()
	@IsString()
	@MaxLength(16)
	public passport!: string;

	@ApiProperty({
		name: "passport_given_by",
		example: "Toshkent shahar chilonzor IIB",
		description: "passport given by of client",
	})
	@IsNotEmpty()
	@IsString()
	public passport_given_by!: string;

	@ApiProperty({
		name: "pinfl",
		example: "12547896345784",
		description: "PINFL of client, max 32 lenth",
	})
	@IsNotEmpty()
	@IsNumberString()
	@MaxLength(32)
	public pinfl!: string;

	@ApiProperty({
		name: "birthday",
		example: 1776272,
		description: "birthday of client",
	})
	@IsNotEmpty()
	@IsNumber()
	public birthday!: number;

	@ApiProperty({
		name: "phone",
		example: "+998999002559",
		description: "phone of client",
	})
	@IsNotEmpty()
	@IsString()
	public phone!: string;

	@ApiProperty({
		name: "address",
		example: "Toshkent Mirobod 75 uy",
		description: "address of client",
	})
	@IsNotEmpty()
	@IsString()
	public address!: string;

	@ApiProperty({
		name: "passport_expire_date",
		example: 1765894234,
		description: "passport expire date of client",
	})
	@IsNotEmpty()
	@IsNumber()
	public passport_expire_date!: number;
}
