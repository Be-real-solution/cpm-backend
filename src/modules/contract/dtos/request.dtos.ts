import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger'
import { PaginationRequestDto } from '../../../common'
import { ContractCreateRequest, ContractDeleteRequest, ContractGetAllRequest, ContractGetOneByIdRequest, ContractUpdateRequest } from '../interfaces'
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator'
import { Type } from 'class-transformer'
import { $Enums, ContractStatusEnum, PaymentMethodEnum } from '@prisma/client'
import { ContractProductCreateRequest } from '../../contract-product/interfaces'
import { ContractProductCreateRequestDto } from '../../contract-product/dtos'

export class ContractGetAllRequestDto extends PaginationRequestDto implements ContractGetAllRequest {
	@ApiPropertyOptional({ type: String })
	@IsUUID('4')
	@IsOptional()
	clientId?: string

	@ApiPropertyOptional({ type: Number })
	@IsNumber()
	@IsOptional()
	@Type(() => Number)
	monthCount?: number

	@ApiPropertyOptional({ type: String })
	@IsEnum(PaymentMethodEnum)
	@IsOptional()
	paymentMethod?: $Enums.PaymentMethodEnum

	@ApiPropertyOptional({ type: String })
	@IsEnum(ContractStatusEnum)
	@IsOptional()
	status?: $Enums.ContractStatusEnum

	@ApiPropertyOptional({ type: String })
	@IsString()
	@IsOptional()
	name?: string
}

export class ContractGetOneByIdRequestDto implements ContractGetOneByIdRequest {
	@ApiProperty({ type: String })
	@IsUUID('4')
	@IsNotEmpty()
	id: string
}

export class ContractCreateRequestDto implements ContractCreateRequest {
	@ApiProperty({ type: String })
	@IsUUID('4')
	@IsNotEmpty()
	clientId: string

	@ApiProperty({ type: Number })
	@IsNumber()
	@IsNotEmpty()
	monthCount: number

	@ApiProperty({ type: String })
	@IsString()
	@IsNotEmpty()
	name: string

	@ApiProperty({ type: String })
	@IsEnum(PaymentMethodEnum)
	@IsNotEmpty()
	paymentMethod: $Enums.PaymentMethodEnum

	@ApiProperty({ type: Number })
	@IsNumber()
	@IsNotEmpty()
	paymentValue: number

	@ApiPropertyOptional({ type: OmitType(ContractProductCreateRequestDto, ['contractId']), isArray: true })
	products: Omit<ContractProductCreateRequest, 'contractId'>[]
}

export class ContractUpdateRequestDto implements ContractUpdateRequest {
	@ApiPropertyOptional({ type: String })
	@IsUUID('4')
	@IsOptional()
	clientId?: string

	@ApiPropertyOptional({ type: Number })
	@IsNumber()
	@IsOptional()
	monthCount?: number

	@ApiPropertyOptional({ type: String })
	@IsEnum(PaymentMethodEnum)
	@IsOptional()
	paymentMethod?: $Enums.PaymentMethodEnum

	@ApiPropertyOptional({ type: String })
	@IsEnum(ContractStatusEnum)
	@IsOptional()
	status?: $Enums.ContractStatusEnum

	@ApiPropertyOptional({ type: String })
	@IsString()
	@IsOptional()
	name?: string

	@ApiPropertyOptional({ type: Number })
	@IsNumber()
	@IsOptional()
	paymentValue?: number
}

export class ContractDeleteRequestDto implements ContractDeleteRequest {
	@ApiProperty({ type: String })
	@IsUUID('4')
	@IsNotEmpty()
	id: string
}
