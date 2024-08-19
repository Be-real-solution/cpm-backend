import { PaginationRequestDto } from '../../../common'
import { ShopCreateRequest, ShopDeleteRequest, ShopGetAllRequest, ShopGetOneByIdRequest, ShopUpdateRequest } from '../interfaces'

export class ShopGetAllRequestDto extends PaginationRequestDto implements ShopGetAllRequest {
	accountable?: string
	address?: string
	director?: string
	isActive?: boolean
	manager?: string
	monthlyPay?: number
	name?: string
	paymentDay?: number
	phone?: string
	secondPhone: string
	username?: string
}

export class ShopGetOneByIdRequestDto implements ShopGetOneByIdRequest {
	id: string
}

export class ShopCreateRequestDto implements ShopCreateRequest {
	accountable: string
	address: string
	director: string
	manager: string
	monthlyPay: number
	name: string
	password: string
	paymentDay: number
	secondPhone: string
	phone: string
	username: string
}

export class ShopUpdateRequestDto implements ShopUpdateRequest {
	accountable?: string
	address?: string
	director?: string
	isActive?: boolean
	manager?: string
	monthlyPay?: number
	name?: string
	password?: string
	paymentDay?: number
	phone?: string
	secondPhone?: string
	username?: string
}

export class ShopDeleteRequestDto implements ShopDeleteRequest {
	id: string
}
