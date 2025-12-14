import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreatePayDto {
	@ApiProperty()
	@IsNotEmpty()
	store_id!: string;

	@ApiProperty()
	@IsNotEmpty()
	amount!: number;

}
