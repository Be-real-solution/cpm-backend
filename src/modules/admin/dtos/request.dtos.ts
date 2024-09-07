import { $Enums, AdminTypeEnum } from '@prisma/client'
import { PaginationRequestDto } from '../../../common'
import { AdminCreateRequest, AdminDeleteRequest, AdminGetAllRequest, AdminGetOneByIdRequest, AdminUpdateRequest } from '../interfaces'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsBooleanString, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'

export class AdminGetAllRequestDto extends PaginationRequestDto implements AdminGetAllRequest {
	@ApiPropertyOptional({ type: String })
	@IsString()
	@IsOptional()
	fullName?: string

	@ApiPropertyOptional({ type: Boolean })
	@IsBooleanString()
	@IsOptional()
	isMain?: boolean

	@ApiPropertyOptional({ type: String })
	@IsString()
	@IsOptional()
	username?: string

	@ApiPropertyOptional({ type: String, example: 'super' })
	@IsEnum(AdminTypeEnum)
	@IsOptional()
	type?: $Enums.AdminTypeEnum
}

export class AdminGetOneByIdRequestDto implements AdminGetOneByIdRequest {
	@ApiPropertyOptional({ type: String })
	@IsUUID('4')
	@IsNotEmpty()
	id: string
}

export class AdminCreateRequestDto implements AdminCreateRequest {
	@ApiProperty({ type: String })
	@IsString()
	@IsNotEmpty()
	fullName: string

	@ApiProperty({ type: String })
	@IsString()
	@IsNotEmpty()
	password: string

	@ApiProperty({ type: String })
	@IsString()
	@IsNotEmpty()
	username: string

	@ApiPropertyOptional({ type: String, example: 'super' })
	@IsEnum(AdminTypeEnum)
	@IsOptional()
	type?: $Enums.AdminTypeEnum
}

export class AdminUpdateRequestDto implements AdminUpdateRequest {
	@ApiPropertyOptional({ type: String })
	@IsString()
	@IsOptional()
	fullName?: string

	@ApiPropertyOptional({ type: String })
	@IsString()
	@IsOptional()
	password?: string

	@ApiPropertyOptional({ type: String })
	@IsString()
	@IsOptional()
	username?: string

	@ApiPropertyOptional({ type: String, example: 'admin' })
	@IsEnum(AdminTypeEnum)
	@IsOptional()
	type?: $Enums.AdminTypeEnum
}

export class AdminDeleteRequestDto implements AdminDeleteRequest {
	@ApiPropertyOptional({ type: String })
	@IsUUID('4')
	@IsNotEmpty()
	id: string
}
