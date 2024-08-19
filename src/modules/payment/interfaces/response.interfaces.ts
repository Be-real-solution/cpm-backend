import { PaginationResponse } from '../../../interfaces'

export declare type PaymentGetAllResponse = PaginationResponse<PaymentGetOneResponse>

export declare interface PaymentGetOneResponse {
	id: string
	sum: number
	shopId: string
	createdAt: Date
}

export declare type PaymentMonthlyGetAllResponse = PaginationResponse<PaymentMonthlyGetOneResponse>

export declare interface PaymentMonthlyGetOneResponse {
	id: string
	sum: number
	shopId: string
	forMonth: number
	forYear: number
	monthlyPay: number
	createdAt: Date
}
