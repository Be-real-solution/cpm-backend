import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateStoreContractPDFDto {
	@ApiProperty({
		name: "store",
		example: "21a9d67b-d8b5-4659-9ee6-43a75f60aed2",
		description: "store id of store",
	})
	@IsNotEmpty()
	@IsString()
	@IsUUID()
	public store!: string;

	@ApiProperty({
		name: "language",
		example: "uz",
		description: "language uz or ru for pdf",
	})
	@IsNotEmpty()
	@IsEnum(["uz", "ru"])
	public language!: string;
}