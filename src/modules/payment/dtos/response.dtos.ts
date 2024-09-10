import { ApiProperty } from '@nestjs/swagger'
import { PaginationResponseDto } from '../../../common'
import { PaymentGetAllResponse, PaymentGetOneResponse, PaymentMonthlyGetAllResponse, PaymentMonthlyGetOneResponse } from '../interfaces'
import { ShopGetOneResponse } from '../../shop/interfaces'
import { ShopGetOneResponseDto } from '../../shop/dtos'

export class PaymentGetOneResponseDto implements PaymentGetOneResponse {
	@ApiProperty({ type: String })
	id: string

	@ApiProperty({ type: ShopGetOneResponseDto })
	shop: ShopGetOneResponse

	@ApiProperty({ type: Number })
	sum: number

	@ApiProperty({ type: Date, example: new Date() })
	createdAt: Date
}
export class PaymentGetAllResponseDto extends PaginationResponseDto implements PaymentGetAllResponse {
	@ApiProperty({ type: PaymentGetOneResponseDto, isArray: true })
	data: PaymentGetOneResponse[]
}

//==

export class PaymentMonthlyGetOneResponseDto implements PaymentMonthlyGetOneResponse {
	@ApiProperty({ type: String })
	id: string

	@ApiProperty({ type: Number })
	forMonth: number

	@ApiProperty({ type: Number })
	forYear: number

	@ApiProperty({ type: Number })
	monthlyPay: number

	@ApiProperty({ type: ShopGetOneResponseDto })
	shop: ShopGetOneResponse

	@ApiProperty({ type: Number })
	sum: number

	@ApiProperty({ type: Date, example: new Date() })
	createdAt: Date
}
export class PaymentMonthlyGetAllResponseDto extends PaginationResponseDto implements PaymentMonthlyGetAllResponse {
	@ApiProperty({ type: PaymentMonthlyGetOneResponseDto, isArray: true })
	data: PaymentMonthlyGetOneResponse[]
}
