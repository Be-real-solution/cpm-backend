import { ContractStatusEnum, PaymentMethodEnum } from '@prisma/client'
import { PaginationRequest } from '../../../interfaces'
import { ContractProductCreateRequest } from '../../contract-product/interfaces'

export declare interface ContractGetAllRequest extends PaginationRequest {
	name?: string
	clientId?: string
	monthCount?: number
	paymentMethod?: PaymentMethodEnum
	status?: ContractStatusEnum
}

export declare interface ContractGetOneByIdRequest {
	id: string
}

export declare interface ContractGetOneRequest {
	id?: string
	name?: string
	clientId?: string
	monthCount?: number
	paymentMethod?: PaymentMethodEnum
	status?: ContractStatusEnum
	ID?: string
}

export declare interface ContractCreateRequest {
	name: string
	clientId: string
	monthCount: number
	paymentMethod: PaymentMethodEnum
	paymentValue: number
	products: Omit<ContractProductCreateRequest, 'contractId'>[]
}

export declare interface ContractUpdateRequest {
	name?: string
	clientId?: string
	monthCount?: number
	paymentMethod?: PaymentMethodEnum
	status?: ContractStatusEnum
	paymentValue?: number
	starterFile?: string
}

export declare interface ContractDeleteRequest {
	id: string
}
