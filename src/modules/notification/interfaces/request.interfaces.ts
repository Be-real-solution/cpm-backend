import { PaginationRequest } from '../../../interfaces'

export declare interface NotificationGetAllRequest extends PaginationRequest {
	title?: string
	subtitle?: string
	shopId?: string
	read?: boolean
}

export declare interface NotificationGetOneByIdRequest {
	id: string
}

export declare interface NotificationGetOneRequest {
	id?: string
	title?: string
	subtitle?: string
	shopId?: string
	read?: boolean
}

export declare interface NotificationCreateRequest {
	title: string
	subtitle: string
	shopIds: string[]
}

export declare interface NotificationUpdateRequest {
	title?: string
	subtitle?: string
	shopIds?: string[]
	shopIdsToRemove?: string[]
}

export declare interface NotificationDeleteRequest {
	id: string
}
