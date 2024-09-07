import { ApiProperty } from '@nestjs/swagger'
import { PaginationResponseDto } from '../../../common'
import { ShopGetAllResponse, ShopGetOneResponse } from '../interfaces'

export class ShopGetOneResponseDto implements ShopGetOneResponse {
	@ApiProperty({ type: String })
	id: string
	@ApiProperty({ type: String })
	accountable: string

	@ApiProperty({ type: String })
	address: string

	@ApiProperty({ type: String })
	director: string

	@ApiProperty({ type: Boolean })
	isActive: boolean

	@ApiProperty({ type: String })
	manager: string

	@ApiProperty({ type: Number })
	monthlyPay: number

	@ApiProperty({ type: String })
	name: string

	@ApiProperty({ type: Number })
	paymentDay: number

	@ApiProperty({ type: String })
	phone: string

	@ApiProperty({ type: String })
	secondPhone: string

	@ApiProperty({ type: String })
	username: string

	@ApiProperty({ type: Date, example: new Date() })
	createdAt: Date
}
export class ShopGetAllResponseDto extends PaginationResponseDto implements ShopGetAllResponse {
	@ApiProperty({ type: ShopGetOneResponseDto, isArray: true })
	data: ShopGetOneResponse[]
}
