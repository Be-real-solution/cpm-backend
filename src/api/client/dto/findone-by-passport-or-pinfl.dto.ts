import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumberString, IsOptional, IsString, MaxLength } from "class-validator";

export class FindOneByPassportOrPinflDto {
	@ApiPropertyOptional({
		name: "passport",
		example: "AB5896347",
		description: "passport of client, max 16 lenth",
	})
	@IsOptional()
	@IsString()
	@MaxLength(16)
	public passport!: string;

	@ApiPropertyOptional({
		name: "pinfl",
		example: "12547896345784",
		description: "PINFL of client, max 32 lenth",
	})
	@IsOptional()
	@IsNumberString()
	@MaxLength(32)
	public pinfl!: string;
}