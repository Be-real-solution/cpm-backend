import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, Min } from "class-validator";

export class PaginationDto {
	@ApiPropertyOptional({ description: "The current page number. Default value: 1", example: 1 })
	@IsOptional()
	@IsNumber()
	@Min(1)
	@Type(() => Number)
	page: number = 1;

	@ApiPropertyOptional({
		description: "The number of items per page. Default value: 10",
		example: 10,
	})
	@IsOptional()
	@IsNumber()
	@Min(1)
	@Type(() => Number)
	page_size: number = 10;
}
