import { PaginationRequest } from '../../../interfaces'

export declare interface PaymentGetAllRequest extends PaginationRequest {
	shopId?: string
}

export declare interface PaymentGetOneByIdRequest {
	id: string
}

export declare interface PaymentGetOneRequest {
	id?: string
	shopId?: string
}

export declare interface PaymentCreateRequest {
	shopId: string
	sum: number
}

//=

export declare interface PaymentMonthlyGetAllRequest extends PaginationRequest {
	shopId?: string
	monthlyPay?: number
	forMonth?: number
	forYear?: number
}

export declare interface PaymentMonthlyGetOneByIdRequest {
	id: string
}

export declare interface PaymentMonthlyGetOneRequest {
	id?: string
	shopId?: string
	monthlyPay?: number
	forMonth?: number
	forYear?: number
}
