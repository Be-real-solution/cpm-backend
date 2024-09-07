import { ApiProperty } from '@nestjs/swagger'
import { PaginationResponseDto } from '../../../common'
import { AdminGetAllResponse, AdminGetOneResponse } from '../interfaces'

export class AdminGetOneResponseDto implements AdminGetOneResponse {
	@ApiProperty({ type: String })
	id: string

	@ApiProperty({ type: String })
	fullName: string

	@ApiProperty({ type: Boolean })
	isMain: boolean

	@ApiProperty({ type: String })
	type: string

	@ApiProperty({ type: String })
	username: string

	@ApiProperty({ type: Date, example: new Date() })
	createdAt: Date
}
export class AdminGetAllResponseDto extends PaginationResponseDto implements AdminGetAllResponse {
	@ApiProperty({ type: AdminGetOneResponseDto, isArray: true })
	data: AdminGetOneResponse[]
}
