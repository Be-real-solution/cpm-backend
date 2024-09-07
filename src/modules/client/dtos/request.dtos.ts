import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { PaginationRequestDto } from '../../../common'
import { ClientCreateRequest, ClientDeleteRequest, ClientGetAllRequest, ClientGetOneByIdRequest, ClientUpdateRequest } from '../interfaces'
import { IsBoolean, IsBooleanString, IsDateString, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsUUID } from 'class-validator'

export class ClientGetAllRequestDto extends PaginationRequestDto implements ClientGetAllRequest {
	@ApiPropertyOptional({ type: String })
	@IsString()
	@IsOptional()
	address?: string

	@ApiPropertyOptional({ type: String })
	@IsString()
	@IsOptional()
	firstName?: string

	@ApiPropertyOptional({ type: Boolean })
	@IsBooleanString()
	@IsOptional()
	isActive?: boolean

	@ApiPropertyOptional({ type: String })
	@IsString()
	@IsOptional()
	lastName?: string

	@ApiPropertyOptional({ type: String })
	@IsString()
	@IsOptional()
	passport?: string

	@ApiPropertyOptional({ type: String })
	@IsPhoneNumber('UZ')
	@IsOptional()
	phone?: string

	@ApiPropertyOptional({ type: String })
	@IsString()
	@IsOptional()
	secondAddress?: string

	@ApiPropertyOptional({ type: String })
	@IsUUID('4')
	@IsOptional()
	shopId?: string
}

export class ClientGetOneByIdRequestDto implements ClientGetOneByIdRequest {
	@ApiProperty({ type: String })
	@IsUUID('4')
	@IsNotEmpty()
	id: string
}

export class ClientCreateRequestDto implements ClientCreateRequest {
	@ApiProperty({ type: String })
	@IsString()
	@IsNotEmpty()
	address: string

	@ApiProperty({ type: Date, example: new Date() })
	@IsDateString()
	@IsNotEmpty()
	birthday: Date

	@ApiProperty({ type: String })
	@IsString()
	@IsNotEmpty()
	firstName: string

	@ApiProperty({ type: String })
	@IsString()
	@IsNotEmpty()
	lastName: string

	@ApiProperty({ type: String })
	@IsString()
	@IsNotEmpty()
	passport: string

	@ApiProperty({ type: String })
	@IsPhoneNumber('UZ')
	@IsNotEmpty()
	phone: string

	@ApiProperty({ type: String })
	@IsString()
	@IsNotEmpty()
	secondAddress: string

	@ApiProperty({ type: String })
	@IsUUID('4')
	@IsNotEmpty()
	shopId: string
}

export class ClientUpdateRequestDto implements ClientUpdateRequest {
	@ApiPropertyOptional({ type: String })
	@IsString()
	@IsOptional()
	address?: string

	@ApiPropertyOptional({ type: Date, example: new Date() })
	@IsDateString()
	@IsOptional()
	birthday?: Date

	@ApiPropertyOptional({ type: String })
	@IsString()
	@IsOptional()
	firstName?: string

	@ApiPropertyOptional({ type: Boolean })
	@IsBoolean()
	@IsOptional()
	isActive?: boolean

	@ApiPropertyOptional({ type: String })
	@IsString()
	@IsOptional()
	lastName?: string

	@ApiPropertyOptional({ type: String })
	@IsString()
	@IsOptional()
	passport?: string

	@ApiPropertyOptional({ type: String })
	@IsPhoneNumber('UZ')
	@IsOptional()
	phone?: string

	@ApiPropertyOptional({ type: String })
	@IsString()
	@IsOptional()
	secondAddress?: string
}

export class ClientDeleteRequestDto implements ClientDeleteRequest {
	@ApiProperty({ type: String })
	@IsUUID('4')
	@IsNotEmpty()
	id: string
}
