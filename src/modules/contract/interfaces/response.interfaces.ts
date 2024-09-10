import { PaginationResponse } from '../../../interfaces'
import { ClientGetOneResponse } from '../../client/interfaces'
import { ContractProductGetOneResponse } from '../../contract-product/interfaces'

export declare type ContractGetAllResponse = PaginationResponse<ContractGetOneResponse>

export declare interface ContractGetOneResponse {
	id: string
	ID: number
	starterFile: string
	name: string
	client: ClientGetOneResponse
	monthCount: number
	paymentMethod: string
	status: string
	paymentValue: number
	createdAt: Date
	products?: ContractProductGetOneResponse[]
}
