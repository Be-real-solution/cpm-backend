import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { PaginationRequestDto } from '../../../common'
import { NotificationCreateRequest, NotificationDeleteRequest, NotificationGetAllRequest, NotificationGetOneByIdRequest, NotificationUpdateRequest } from '../interfaces'
import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'
import { Type } from 'class-transformer'

export class NotificationGetAllRequestDto extends PaginationRequestDto implements NotificationGetAllRequest {
	@ApiPropertyOptional({ type: Boolean })
	@IsBoolean()
	@IsOptional()
	@Type(() => Boolean)
	read?: boolean

	@ApiPropertyOptional({ type: String })
	@IsUUID('4')
	@IsOptional()
	shopId?: string

	@ApiPropertyOptional({ type: String })
	@IsString()
	@IsOptional()
	subtitle?: string

	@ApiPropertyOptional({ type: String })
	@IsString()
	@IsOptional()
	title?: string
}

export class NotificationGetOneByIdRequestDto implements NotificationGetOneByIdRequest {
	@ApiProperty({ type: String })
	@IsUUID('4')
	@IsNotEmpty()
	id: string
}

export class NotificationCreateRequestDto implements NotificationCreateRequest {
	@ApiProperty({ type: String })
	@IsString()
	@IsNotEmpty()
	title: string

	@ApiProperty({ type: String })
	@IsString()
	@IsNotEmpty()
	subtitle: string

	@ApiProperty({ type: String, isArray: true })
	@IsArray()
	@IsUUID('4', { each: true })
	@IsNotEmpty()
	shopIds: string[]
}

export class NotificationUpdateRequestDto implements NotificationUpdateRequest {
	@ApiPropertyOptional({ type: String })
	@IsString()
	@IsOptional()
	title?: string

	@ApiPropertyOptional({ type: String })
	@IsString()
	@IsOptional()
	subtitle?: string

	@ApiPropertyOptional({ type: String, isArray: true })
	@IsArray()
	@IsUUID('4', { each: true })
	@IsOptional()
	shopIds?: string[]

	@ApiPropertyOptional({ type: String, isArray: true })
	@IsArray()
	@IsUUID('4', { each: true })
	@IsOptional()
	shopIdsToRemove?: string[]
}

export class NotificationDeleteRequestDto implements NotificationDeleteRequest {
	@ApiProperty({ type: String })
	@IsUUID('4')
	@IsNotEmpty()
	id: string
}
