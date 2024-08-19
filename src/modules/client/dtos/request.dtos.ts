import { PaginationRequestDto } from '../../../common'
import { ClientCreateRequest, ClientDeleteRequest, ClientGetAllRequest, ClientGetOneByIdRequest, ClientUpdateRequest } from '../interfaces'

export class ClientGetAllRequestDto extends PaginationRequestDto implements ClientGetAllRequest {
	address?: string
	firstName?: string
	isActive?: boolean
	lastName?: string
	passport?: string
	phone?: string
	secondAddress?: string
}

export class ClientGetOneByIdRequestDto implements ClientGetOneByIdRequest {
	id: string
}

export class ClientCreateRequestDto implements ClientCreateRequest {
	address: string
	birthday: Date
	firstName: string
	lastName: string
	passport: string
	phone: string
	secondAddress: string
}

export class ClientUpdateRequestDto implements ClientUpdateRequest {
	address?: string
	birthday?: Date
	firstName?: string
	isActive?: boolean
	lastName?: string
	passport?: string
	phone?: string
	secondAddress?: string
}

export class ClientDeleteRequestDto implements ClientDeleteRequest {
	id: string
}
