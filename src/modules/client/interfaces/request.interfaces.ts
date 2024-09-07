import { PaginationRequest } from '../../../interfaces'

export declare interface ClientGetAllRequest extends PaginationRequest {
	phone?: string
	address?: string
	passport?: string
	isActive?: boolean
	lastName?: string
	firstName?: string
	secondAddress?: string
	shopId?: string
}

export declare interface ClientGetOneByIdRequest {
	id: string
}

export declare interface ClientGetOneRequest {
	id?: string
	phone?: string
	address?: string
	passport?: string
	isActive?: boolean
	lastName?: string
	firstName?: string
	secondAddress?: string
	rating?: number
	shopId?: string
}

export declare interface ClientCreateRequest {
	phone: string
	address: string
	passport: string
	birthday: Date
	lastName: string
	firstName: string
	secondAddress: string
	shopId: string
}

export declare interface ClientUpdateRequest {
	phone?: string
	address?: string
	passport?: string
	birthday?: Date
	lastName?: string
	firstName?: string
	secondAddress?: string
	isActive?: boolean
}

export declare interface ClientDeleteRequest {
	id: string
}
