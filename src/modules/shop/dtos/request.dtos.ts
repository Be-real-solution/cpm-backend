import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { PaginationRequestDto } from '../../../common'
import { ShopCreateRequest, ShopDeleteRequest, ShopGetAllRequest, ShopGetOneByIdRequest, ShopUpdateRequest } from '../interfaces'
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString, IsUUID } from 'class-validator'
import { Type } from 'class-transformer'

export class ShopGetAllRequestDto extends PaginationRequestDto implements ShopGetAllRequest {
	@ApiPropertyOptional({ type: String })
	@IsString()
	@IsOptional()
	accountable?: string

	@ApiPropertyOptional({ type: String })
	@IsString()
	@IsOptional()
	address?: string

	@ApiPropertyOptional({ type: String })
	@IsString()
	@IsOptional()
	director?: string

	@ApiPropertyOptional({ type: Boolean })
	@IsBoolean()
	@IsOptional()
	@Type(() => Boolean)
	isActive?: boolean

	@ApiPropertyOptional({ type: String })
	@IsString()
	@IsOptional()
	manager?: string

	@ApiPropertyOptional({ type: Number })
	@IsNumber()
	@IsOptional()
	@Type(() => Number)
	monthlyPay?: number

	@ApiPropertyOptional({ type: String })
	@IsString()
	@IsOptional()
	name?: string

	@ApiPropertyOptional({ type: Number })
	@IsNumber()
	@IsOptional()
	@Type(() => Number)
	paymentDay?: number

	@ApiPropertyOptional({ type: String })
	@IsPhoneNumber('UZ')
	@IsOptional()
	phone?: string

	@ApiPropertyOptional({ type: String })
	@IsPhoneNumber('UZ')
	@IsOptional()
	secondPhone: string

	@ApiPropertyOptional({ type: String })
	@IsString()
	@IsOptional()
	username?: string
}

export class ShopGetOneByIdRequestDto implements ShopGetOneByIdRequest {
	@ApiProperty({ type: String })
	@IsUUID('4')
	@IsNotEmpty()
	id: string
}

export class ShopCreateRequestDto implements ShopCreateRequest {
	@ApiProperty({ type: String })
	@IsString()
	@IsNotEmpty()
	accountable: string

	@ApiProperty({ type: String })
	@IsString()
	@IsNotEmpty()
	address: string

	@ApiProperty({ type: String })
	@IsString()
	@IsNotEmpty()
	director: string

	@ApiProperty({ type: String })
	@IsString()
	@IsNotEmpty()
	manager: string

	@ApiProperty({ type: Number })
	@IsNumber()
	@IsNotEmpty()
	monthlyPay: number

	@ApiProperty({ type: String })
	@IsString()
	@IsNotEmpty()
	name: string

	@ApiProperty({ type: String })
	@IsString()
	@IsNotEmpty()
	password: string

	@ApiProperty({ type: Number })
	@IsNumber()
	@IsNotEmpty()
	paymentDay: number

	@ApiProperty({ type: String })
	@IsPhoneNumber('UZ')
	@IsNotEmpty()
	secondPhone: string

	@ApiProperty({ type: String })
	@IsPhoneNumber('UZ')
	@IsNotEmpty()
	phone: string

	@ApiProperty({ type: String })
	@IsString()
	@IsNotEmpty()
	username: string
}

export class ShopUpdateRequestDto implements ShopUpdateRequest {
	@ApiPropertyOptional({ type: String })
	@IsString()
	@IsOptional()
	accountable?: string

	@ApiPropertyOptional({ type: String })
	@IsString()
	@IsOptional()
	address?: string

	@ApiPropertyOptional({ type: String })
	@IsString()
	@IsOptional()
	director?: string

	@ApiPropertyOptional({ type: Boolean })
	@IsBoolean()
	@IsOptional()
	@Type(() => Boolean)
	isActive?: boolean

	@ApiPropertyOptional({ type: String })
	@IsString()
	@IsOptional()
	manager?: string

	@ApiPropertyOptional({ type: Number })
	@IsNumber()
	@IsOptional()
	monthlyPay?: number

	@ApiPropertyOptional({ type: String })
	@IsString()
	@IsOptional()
	name?: string

	@ApiPropertyOptional({ type: String })
	@IsString()
	@IsOptional()
	password?: string

	@ApiPropertyOptional({ type: Number })
	@IsNumber()
	@IsOptional()
	paymentDay?: number

	@ApiPropertyOptional({ type: String })
	@IsPhoneNumber('UZ')
	@IsOptional()
	phone?: string

	@ApiPropertyOptional({ type: String })
	@IsPhoneNumber('UZ')
	@IsOptional()
	secondPhone?: string

	@ApiPropertyOptional({ type: String })
	@IsString()
	@IsOptional()
	username?: string
}

export class ShopDeleteRequestDto implements ShopDeleteRequest {
	@ApiProperty({ type: String })
	@IsUUID('4')
	@IsNotEmpty()
	id: string
}
