import { ApiProperty } from '@nestjs/swagger'
import { PaginationResponseDto } from '../../../common'
import { ShopGetAllResponse, ShopGetOneResponse } from '../interfaces'

export class ShopGetOneResponseDto implements ShopGetOneResponse {
	id: string
	accountable: string
	address: string
	director: string
	isActive: boolean
	manager: string
	monthlyPay: number
	name: string
	paymentDay: number
	phone: string
	secondPhone: string
	username: string
	createdAt: Date
}
export class ShopGetAllResponseDto extends PaginationResponseDto implements ShopGetAllResponse {
	@ApiProperty({ type: ShopGetOneResponseDto, isArray: true })
	data: ShopGetOneResponse[]
}
