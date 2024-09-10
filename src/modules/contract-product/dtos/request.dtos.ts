import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { PaginationRequestDto } from '../../../common'
import {
	ContractProductCreateRequest,
	ContractProductDeleteRequest,
	ContractProductGetAllRequest,
	ContractProductGetOneByIdRequest,
	ContractProductUpdateRequest,
} from '../interfaces'
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator'
import { $Enums, UnitTypeEnum } from '@prisma/client'

export class ContractProductGetAllRequestDto extends PaginationRequestDto implements ContractProductGetAllRequest {
	@ApiPropertyOptional({ type: String })
	@IsString()
	@IsOptional()
	name?: string

	@ApiPropertyOptional({ type: String })
	@IsUUID('4')
	@IsOptional()
	contractId?: string

	@ApiPropertyOptional({ type: String })
	@IsEnum(UnitTypeEnum)
	@IsOptional()
	unitType?: $Enums.UnitTypeEnum
}

export class ContractProductGetOneByIdRequestDto implements ContractProductGetOneByIdRequest {
	@ApiProperty({ type: String })
	@IsUUID('4')
	@IsNotEmpty()
	id: string
}

export class ContractProductCreateRequestDto implements ContractProductCreateRequest {
	@ApiProperty({ type: String })
	@IsString()
	@IsNotEmpty()
	name: string

	@ApiProperty({ type: String })
	@IsUUID('4')
	@IsNotEmpty()
	contractId: string

	@ApiProperty({ type: Number })
	@IsNumber()
	@IsNotEmpty()
	count: number

	@ApiProperty({ type: Number })
	@IsNumber()
	@IsNotEmpty()
	price: number

	@ApiProperty({ type: String })
	@IsEnum(UnitTypeEnum)
	@IsNotEmpty()
	unitType: $Enums.UnitTypeEnum
}

export class ContractProductUpdateRequestDto implements ContractProductUpdateRequest {
	@ApiPropertyOptional({ type: String })
	@IsString()
	@IsOptional()
	name?: string

	@ApiPropertyOptional({ type: String })
	@IsUUID('4')
	@IsOptional()
	contractId?: string

	@ApiPropertyOptional({ type: Number })
	@IsNumber()
	@IsOptional()
	count?: number

	@ApiPropertyOptional({ type: Number })
	@IsNumber()
	@IsOptional()
	price?: number

	@ApiPropertyOptional({ type: String })
	@IsEnum(UnitTypeEnum)
	@IsOptional()
	unitType?: $Enums.UnitTypeEnum
}

export class ContractProductDeleteRequestDto implements ContractProductDeleteRequest {
	@ApiProperty({ type: String })
	@IsUUID('4')
	@IsNotEmpty()
	id: string
}
