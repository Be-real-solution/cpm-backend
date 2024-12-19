import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { FilterDto } from "src/common/dto/filter.dto";

export class ContractFilterDto extends FilterDto {
    @ApiPropertyOptional({ name: "client_id", example: "ah4ys9ik32bdjb" })
    @IsOptional()
    @IsString()
    public client_id?: string
}