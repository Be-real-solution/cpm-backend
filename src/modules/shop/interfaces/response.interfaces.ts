import { PaginationResponse } from '../../../interfaces'

export declare type ShopGetAllResponse = PaginationResponse<ShopGetOneResponse>

export declare interface ShopGetOneResponse {
	id: string
	name: string
	phone: string
	address: string
	manager: string
	username: string
	director: string
	isActive: boolean
	paymentDay: number
	monthlyPay: number
	accountable: string
	secondPhone: string
	createdAt: Date
}
