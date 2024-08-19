import { PaginationRequestDto } from '../../../common'
import { PaymentCreateRequest, PaymentGetAllRequest, PaymentGetOneByIdRequest } from '../interfaces'

export class PaymentGetAllRequestDto extends PaginationRequestDto implements PaymentGetAllRequest {
	shopId?: string
}

export class PaymentGetOneByIdRequestDto implements PaymentGetOneByIdRequest {
	id: string
}

export class PaymentCreateRequestDto implements PaymentCreateRequest {
	shopId: string
	sum: number
}

//=

export class PaymentMonthlyGetAllRequestDto extends PaginationRequestDto implements PaymentGetAllRequest {
	forMonth?: number
	forYear?: number
	monthlyPay?: number
	shopId?: string
}

export class PaymentMonthlyGetOneByIdRequestDto implements PaymentGetOneByIdRequest {
	id: string
}
