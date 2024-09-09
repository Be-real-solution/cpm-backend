import { PaginationResponse } from '../../../interfaces'

export declare type ClientGetAllResponse = PaginationResponse<ClientGetOneResponse>

export declare interface ClientShop {
	id: string
	name: string
}

export declare interface ClientStatus {
	shop: ClientShop
	isActive: boolean
}

export declare interface ClientGetOneResponse {
	id: string
	phone: string
	rating: number
	address: string
	passport: string
	birthday: Date
	isActive: boolean
	lastName: string
	firstName: string
	secondAddress: string
	fathersName: string
	jshshir: string
	passportAddress: string
	createdAt: Date
	shops?: ClientStatus[]
}
