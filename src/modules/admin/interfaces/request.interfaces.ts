import { AdminTypeEnum } from '@prisma/client'
import { PaginationRequest } from '../../../interfaces'

export declare interface AdminGetAllRequest extends PaginationRequest {
	type?: AdminTypeEnum
	isMain?: boolean
	username?: string
	fullName?: string
}

export declare interface AdminGetOneByIdRequest {
	id: string
}

export declare interface AdminGetOneRequest {
	id?: string
	type?: AdminTypeEnum
	isMain?: boolean
	username?: string
	fullName?: string
}

export declare interface AdminCreateRequest {
	type?: AdminTypeEnum
	username: string
	password: string
	fullName: string
}

export declare interface AdminUpdateRequest {
	type?: AdminTypeEnum
	username?: string
	password?: string
	fullName?: string
}

export declare interface AdminDeleteRequest {
	id: string
}
