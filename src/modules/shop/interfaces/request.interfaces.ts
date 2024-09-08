import { PaginationRequest } from '../../../interfaces'

export declare interface ShopGetAllRequest extends PaginationRequest {
	name?: string
	phone?: string
	address?: string
	manager?: string
	username?: string
	director?: string
	isActive?: boolean
	paymentDay?: number
	monthlyPay?: number
	accountable?: string
	secondPhone: string
}

export declare interface ShopGetOneByIdRequest {
	id: string
}

export declare interface ShopGetOneRequest {
	id?: string
	name?: string
	phone?: string
	address?: string
	manager?: string
	username?: string
	director?: string
	isActive?: boolean
	paymentDay?: number
	monthlyPay?: number
	accountable?: string
	secondPhone?: string
}

export declare interface ShopCreateRequest {
	name: string
	phone: string
	address: string
	manager: string
	password: string
	username: string
	director: string
	paymentDay: number
	monthlyPay: number
	accountable: string
	secondPhone: string
	contractFile: string
}

export declare interface ShopUpdateRequest {
	name?: string
	phone?: string
	address?: string
	manager?: string
	password?: string
	username?: string
	director?: string
	paymentDay?: number
	monthlyPay?: number
	accountable?: string
	secondPhone?: string
	isActive?: boolean
	contractFile?: string
}

export declare interface ShopDeleteRequest {
	id: string
}
