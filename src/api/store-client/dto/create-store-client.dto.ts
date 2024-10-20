import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsUUID } from "class-validator";
import { UUID } from "crypto";

export class CreateStoreClientDto {
	@ApiProperty({
		name: "store_id",
		example: "ah4ys9ik32bdjb",
		description: "store id for store",
	})
	@IsNotEmpty()
	@IsUUID()
	public store!: string;

	@ApiProperty({
		name: "client_id",
		example: "ah4ys9ik32bdjb",
		description: "client id for store",
	})
	@IsNotEmpty()
	@IsUUID()
	public client!: string;

	@ApiProperty({
		name: "status",
		example: true,
		description: "status of store client",
	})
  @IsOptional()
  @IsBoolean()
	public status!: boolean;
}
