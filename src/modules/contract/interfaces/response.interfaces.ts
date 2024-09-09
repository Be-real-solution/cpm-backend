import { PaginationResponse } from '../../../interfaces'
import { ClientGetOneResponse } from '../../client/interfaces'

export declare type ContractGetAllResponse = PaginationResponse<ContractGetOneResponse>

export declare interface ContractGetOneResponse {
	id: string
	name: string
	client: ClientGetOneResponse
	monthCount: number
	paymentMethod: string
	status: string
	paymentValue: number
	createdAt: Date
}