import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class FindByClientDetailDto {
	@ApiProperty({
		name: "first_name",
		example: "Baxrom",
		description: "firstname of client, max 64 lenth",
	})
  @IsNotEmpty()
  @IsString()
	public first_name!: string;

	@ApiProperty({
		name: "last_name",
		example: "Kamalov",
		description: "lastname of client, max 64 lenth",
	})
  @IsNotEmpty()
  @IsString()
	public last_name!: string;

	@ApiProperty({
		name: "second_name",
		example: "Alisherovich",
		description: "secondname of client, max 64 lenth",
	})
  @IsOptional()
  @IsString()
	public second_name!: string;

	@ApiProperty({
		name: "passport",
		example: "AB5896347",
		description: "passport of client, max 16 lenth",
	})
  @IsNotEmpty()
  @IsString()
	public passport!: string;

	@ApiProperty({
		name: "pinfl",
		example: "12547896345784",
		description: "pinfl of client, max 32 lenth",
	})
  @IsNotEmpty()
  @IsString()
	public pinfl!: string;
}
