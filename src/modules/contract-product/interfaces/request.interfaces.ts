import { UnitTypeEnum } from '@prisma/client'
import { PaginationRequest } from '../../../interfaces'

export declare interface ContractProductGetAllRequest extends PaginationRequest {
	name?: string
	unitType?: UnitTypeEnum
	contractId?: string
}

export declare interface ContractProductGetOneByIdRequest {
	id: string
}

export declare interface ContractProductGetOneRequest {
	id?: string
	name?: string
	unitType?: UnitTypeEnum
	contractId?: string
	price?: number
	count?: number
}

export declare interface ContractProductCreateRequest {
	name: string
	price: number
	count: number
	unitType: UnitTypeEnum
	contractId: string
}

export declare interface ContractProductUpdateRequest {
	name?: string
	price?: number
	count?: number
	unitType?: UnitTypeEnum
	contractId?: string
}

export declare interface ContractProductDeleteRequest {
	id: string
}
