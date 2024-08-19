import { PaginationResponse } from '../../../interfaces'

export declare type AdminGetAllResponse = PaginationResponse<AdminGetOneResponse>

export declare interface AdminGetOneResponse {
	id: string
	type: string
	isMain: boolean
	username: string
	fullName: string
	createdAt: Date
}
