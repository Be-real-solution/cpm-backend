import { PaginationResponse } from '../../../interfaces'
import { ShopGetOneResponse } from '../../shop/interfaces'

export declare type NotificationGetAllResponse = PaginationResponse<NotificationGetOneResponse>

export declare interface NotificationGetOneResponse {
	id: string
	title: string
	subtitle: string
	createdAt: Date
	shops: ShopNotification[]
}

export declare interface ShopNotification {
	id: string
	read: boolean
	shop: ShopGetOneResponse
}
