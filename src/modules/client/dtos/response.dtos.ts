import { ApiProperty } from '@nestjs/swagger'
import { PaginationResponseDto } from '../../../common'
import { ClientGetAllResponse, ClientGetOneResponse, ClientShop, ClientStatus } from '../interfaces'

export class ClientShopDto implements ClientShop {
	@ApiProperty({ type: String })
	id: string

	@ApiProperty({ type: String })
	name: string
}

export class ClientStatusDto implements ClientStatus {
	@ApiProperty({ type: Boolean })
	isActive: boolean

	@ApiProperty({ type: ClientShopDto })
	shop: ClientShop
}
export class ClientGetOneResponseDto implements ClientGetOneResponse {
	@ApiProperty({ type: String })
	id: string

	@ApiProperty({ type: String })
	address: string

	@ApiProperty({ type: Date, example: new Date() })
	birthday: Date

	@ApiProperty({ type: String })
	firstName: string

	@ApiProperty({ type: Boolean })
	isActive: boolean

	@ApiProperty({ type: String })
	lastName: string

	@ApiProperty({ type: String })
	passport: string

	@ApiProperty({ type: String })
	phone: string

	@ApiProperty({ type: Number })
	rating: number

	@ApiProperty({ type: String })
	secondAddress: string

	@ApiProperty({ type: String })
	fathersName: string

	@ApiProperty({ type: String })
	jshshir: string

	@ApiProperty({ type: String })
	passportAddress: string

	@ApiProperty({ type: Date, example: new Date() })
	createdAt: Date

	@ApiProperty({ type: ClientStatusDto, isArray: true })
	shops: ClientStatus[]
}
export class ClientGetAllResponseDto extends PaginationResponseDto implements ClientGetAllResponse {
	@ApiProperty({ type: ClientGetOneResponseDto, isArray: true })
	data: ClientGetOneResponse[]
}
