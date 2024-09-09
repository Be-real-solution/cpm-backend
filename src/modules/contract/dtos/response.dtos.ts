import { ApiProperty } from '@nestjs/swagger'
import { PaginationResponseDto } from '../../../common'
import { ContractGetAllResponse, ContractGetOneResponse } from '../interfaces'
import { ClientGetOneResponse } from '../../client/interfaces'
import { ClientGetOneResponseDto } from '../../client/dtos'

export class ContractGetOneResponseDto implements ContractGetOneResponse {
	@ApiProperty({ type: String })
	id: string

	@ApiProperty({ type: ClientGetOneResponseDto })
	client: ClientGetOneResponse

	@ApiProperty({ type: Number })
	monthCount: number

	@ApiProperty({ type: String })
	name: string

	@ApiProperty({ type: String })
	paymentMethod: string

	@ApiProperty({ type: Number })
	paymentValue: number

	@ApiProperty({ type: String })
	status: string

	@ApiProperty({ type: Date, example: new Date() })
	createdAt: Date
}
export class ContractGetAllResponseDto extends PaginationResponseDto implements ContractGetAllResponse {
	@ApiProperty({ type: ContractGetOneResponseDto, isArray: true })
	data: ContractGetOneResponse[]
}
