import { PaginationResponse } from '../../../interfaces'

export declare type ClientGetAllResponse = PaginationResponse<ClientGetOneResponse>

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
	createdAt: Date
}
