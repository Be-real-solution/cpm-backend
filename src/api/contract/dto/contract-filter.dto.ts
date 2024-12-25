import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumberString, IsOptional, IsString } from "class-validator";
import { FilterDto } from "src/common/dto/filter.dto";

export class ContractFilterDto extends FilterDto {
	@ApiPropertyOptional({ name: "client_id", example: "ah4ys9ik32bdjb" })
	@IsOptional()
	@IsString()
	public client_id?: string;

	@ApiPropertyOptional({ name: "from", example: "261517327" })
	@IsOptional()
	@IsNumberString()
	public from?: number;

	@ApiPropertyOptional({ name: "to", example: "261517327" })
	@IsOptional()
	@IsNumberString()
	public to?: number;
}