import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, MaxLength, ValidateNested } from "class-validator";
import { ObjDto } from "src/common/type";

export class StoreNotificationDto {

}

export class CreateNotificationDto {
	@ApiProperty({
		name: "title",
		example: "To'lov",
		description: "title of notification",
	})
	@IsNotEmpty()
	@IsString()
	@MaxLength(255)
	public title!: string;

	@ApiProperty({
		name: "description",
		example: "To'lov kuni keldi",
		description: "description of notification",
	})
	@IsNotEmpty()
	@IsString()
	@MaxLength(500)
	public description!: string;

	@ApiPropertyOptional({
		name: "stores",
    example: ObjDto,
    examples: [ObjDto],
		description: "stores of notification",
	})
	@IsOptional()
	@ValidateNested({ each: true })
	@Type(() => ObjDto)
	public stores!: ObjDto[];
}
