import { ApiProperty } from '@nestjs/swagger'
import { PaginationResponseDto } from '../../../common'
import { ContractProductGetAllResponse, ContractProductGetOneResponse } from '../interfaces'
import { ContractGetOneResponse } from '../../contract/interfaces'
import { ContractGetOneResponseDto } from '../../contract/dtos'

export class ContractProductGetOneResponseDto implements ContractProductGetOneResponse {
	@ApiProperty({ type: String })
	id: string

	@ApiProperty({ type: ContractGetOneResponseDto })
	contract?: ContractGetOneResponse

	@ApiProperty({ type: Number })
	count: number

	@ApiProperty({ type: String })
	name: string

	@ApiProperty({ type: Number })
	price: number

	@ApiProperty({ type: String })
	unitType: string

	@ApiProperty({ type: Date, example: new Date() })
	createdAt: Date
}
export class ContractProductGetAllResponseDto extends PaginationResponseDto implements ContractProductGetAllResponse {
	@ApiProperty({ type: ContractProductGetOneResponseDto, isArray: true })
	data: ContractProductGetOneResponse[]
}
