import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsBooleanString, IsOptional } from "class-validator";
import { boolean } from "fp-ts";
import { FilterDto } from "src/common/dto/filter.dto";

export class StoreFilterDto extends FilterDto {
	@ApiPropertyOptional({ name: "is_debtor", example: false })
	@IsOptional()
  @IsBooleanString()
	public is_debtor!: boolean;
}
