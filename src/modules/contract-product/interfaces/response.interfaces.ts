import { PaginationResponse } from '../../../interfaces'
import { ContractGetOneResponse } from '../../contract/interfaces'

export declare type ContractProductGetAllResponse = PaginationResponse<ContractProductGetOneResponse>

export declare interface ContractProductGetOneResponse {
	id: string
	name: string
	price: number
	count: number
	unitType: string
	contract?: ContractGetOneResponse
	createdAt: Date
}
