import { PaginationResponse } from '../../../interfaces'
import { ShopGetOneResponse } from '../../shop/interfaces'

export declare type PaymentGetAllResponse = PaginationResponse<PaymentGetOneResponse>

export declare interface PaymentGetOneResponse {
	id: string
	sum: number
	shop: ShopGetOneResponse
	createdAt: Date
}

export declare type PaymentMonthlyGetAllResponse = PaginationResponse<PaymentMonthlyGetOneResponse>

export declare interface PaymentMonthlyGetOneResponse {
	id: string
	sum: number
	shop: ShopGetOneResponse
	forMonth: number
	forYear: number
	monthlyPay: number
	createdAt: Date
}
