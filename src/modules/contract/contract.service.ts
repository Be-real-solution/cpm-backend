import { BadRequestException, Injectable } from '@nestjs/common'
import { ContractRepo } from './contract.repo'
import {
	ContractCreateRequest,
	ContractDeleteRequest,
	ContractGetAllRequest,
	ContractGetAllResponse,
	ContractGetOneByIdRequest,
	ContractGetOneRequest,
	ContractGetOneResponse,
	ContractUpdateRequest,
} from './interfaces'
import { MutationResponse } from '../../interfaces'

@Injectable()
export class ContractService {
	private readonly repo: ContractRepo
	constructor(repo: ContractRepo) {
		this.repo = repo
	}

	async getAll(payload: ContractGetAllRequest): Promise<ContractGetAllResponse | ContractGetOneResponse[]> {
		return this.repo.getAll(payload)
	}

	async getOneById(payload: ContractGetOneByIdRequest): Promise<ContractGetOneResponse> {
		const contract = await this.repo.getOneById(payload)
		if (!contract) {
			throw new BadRequestException('contract not found')
		}
		return contract
	}

	async getOne(payload: ContractGetOneRequest): Promise<ContractGetOneResponse> {
		const contract = await this.repo.getOne(payload)

		return contract
	}

	async create(payload: ContractCreateRequest): Promise<MutationResponse> {
		return this.repo.create({ ...payload })
	}

	async update(param: ContractGetOneByIdRequest, payload: ContractUpdateRequest): Promise<MutationResponse> {
		await this.getOneById(param)

		return this.repo.update({ ...param, ...payload })
	}

	async delete(payload: ContractDeleteRequest): Promise<MutationResponse> {
		await this.getOneById(payload)
		return this.repo.delete(payload)
	}
}
