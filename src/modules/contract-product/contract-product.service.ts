import { BadRequestException, Injectable } from '@nestjs/common'
import { ContractProductRepo } from './contract-product.repo'
import {
	ContractProductCreateRequest,
	ContractProductDeleteRequest,
	ContractProductGetAllRequest,
	ContractProductGetAllResponse,
	ContractProductGetOneByIdRequest,
	ContractProductGetOneRequest,
	ContractProductGetOneResponse,
	ContractProductUpdateRequest,
} from './interfaces'
import { MutationResponse } from '../../interfaces'

@Injectable()
export class ContractProductService {
	private readonly repo: ContractProductRepo
	constructor(repo: ContractProductRepo) {
		this.repo = repo
	}

	async getAll(payload: ContractProductGetAllRequest): Promise<ContractProductGetAllResponse | ContractProductGetOneResponse[]> {
		return this.repo.getAll(payload)
	}

	async getOneById(payload: ContractProductGetOneByIdRequest): Promise<ContractProductGetOneResponse> {
		const contractProduct = await this.repo.getOneById(payload)
		if (!contractProduct) {
			throw new BadRequestException('contract product not found')
		}
		return contractProduct
	}

	async getOne(payload: ContractProductGetOneRequest): Promise<ContractProductGetOneResponse> {
		const contractProduct = await this.repo.getOne(payload)

		return contractProduct
	}

	async create(payload: ContractProductCreateRequest): Promise<MutationResponse> {
		return this.repo.create({ ...payload })
	}

	async update(param: ContractProductGetOneByIdRequest, payload: ContractProductUpdateRequest): Promise<MutationResponse> {
		await this.getOneById(param)

		return this.repo.update({ ...param, ...payload })
	}

	async delete(payload: ContractProductDeleteRequest): Promise<MutationResponse> {
		await this.getOneById(payload)
		return this.repo.delete(payload)
	}
}
