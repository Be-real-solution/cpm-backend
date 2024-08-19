import { ApiProperty } from '@nestjs/swagger'
import { PaginationResponseDto } from '../../../common'
import { PaymentGetAllResponse, PaymentGetOneResponse, PaymentMonthlyGetAllResponse, PaymentMonthlyGetOneResponse } from '../interfaces'

export class PaymentGetOneResponseDto implements PaymentGetOneResponse {
	id: string
	shopId: string
	sum: number
	createdAt: Date
}
export class PaymentGetAllResponseDto extends PaginationResponseDto implements PaymentGetAllResponse {
	@ApiProperty({ type: PaymentGetOneResponseDto, isArray: true })
	data: PaymentGetOneResponse[]
}

//==

export class PaymentMonthlyGetOneResponseDto implements PaymentMonthlyGetOneResponse {
	id: string
	forMonth: number
	forYear: number
	monthlyPay: number
	shopId: string
	sum: number
	createdAt: Date
}
export class PaymentMonthlyGetAllResponseDto extends PaginationResponseDto implements PaymentMonthlyGetAllResponse {
	@ApiProperty({ type: PaymentMonthlyGetOneResponseDto, isArray: true })
	data: PaymentMonthlyGetOneResponse[]
}
