import { ApiProperty } from '@nestjs/swagger'
import { PaginationResponseDto } from '../../../common'
import { AdminGetAllResponse, AdminGetOneResponse } from '../interfaces'

export class AdminGetOneResponseDto implements AdminGetOneResponse {
	id: string
	fullName: string
	isMain: boolean
	type: string
	username: string
	createdAt: Date
}
export class AdminGetAllResponseDto extends PaginationResponseDto implements AdminGetAllResponse {
	@ApiProperty({ type: AdminGetOneResponseDto, isArray: true })
	data: AdminGetOneResponse[]
}
