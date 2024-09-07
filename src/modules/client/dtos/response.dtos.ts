import { ApiProperty } from '@nestjs/swagger'
import { PaginationResponseDto } from '../../../common'
import { ClientGetAllResponse, ClientGetOneResponse, ClientStatus } from '../interfaces'

export class ClientGetOneResponseDto implements ClientGetOneResponse {
	id: string
	address: string
	birthday: Date
	firstName: string
	isActive: boolean
	lastName: string
	passport: string
	phone: string
	rating: number
	secondAddress: string
	createdAt: Date
	shops: ClientStatus[]
}
export class ClientGetAllResponseDto extends PaginationResponseDto implements ClientGetAllResponse {
	@ApiProperty({ type: ClientGetOneResponseDto, isArray: true })
	data: ClientGetOneResponse[]
}
