import { $Enums } from '@prisma/client'
import { PaginationRequestDto } from '../../../common'
import { AdminCreateRequest, AdminDeleteRequest, AdminGetAllRequest, AdminGetOneByIdRequest, AdminUpdateRequest } from '../interfaces'

export class AdminGetAllRequestDto extends PaginationRequestDto implements AdminGetAllRequest {
	fullName?: string
	isMain?: boolean
	username?: string
	type?: $Enums.AdminTypeEnum
}

export class AdminGetOneByIdRequestDto implements AdminGetOneByIdRequest {
	id: string
}

export class AdminCreateRequestDto implements AdminCreateRequest {
	fullName: string
	password: string
	username: string
	type?: $Enums.AdminTypeEnum
}

export class AdminUpdateRequestDto implements AdminUpdateRequest {
	fullName?: string
	password?: string
	username?: string
	type?: $Enums.AdminTypeEnum
}

export class AdminDeleteRequestDto implements AdminDeleteRequest {
	id: string
}
