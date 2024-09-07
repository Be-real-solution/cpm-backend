import { BadRequestException, Injectable } from '@nestjs/common'
import { ClientRepo } from './client.repo'
import {
	ClientCreateRequest,
	ClientDeleteRequest,
	ClientGetAllRequest,
	ClientGetAllResponse,
	ClientGetOneByIdRequest,
	ClientGetOneRequest,
	ClientGetOneResponse,
	ClientUpdateRequest,
} from './interfaces'
import { MutationResponse } from '../../interfaces'

@Injectable()
export class ClientService {
	private readonly repo: ClientRepo
	constructor(repo: ClientRepo) {
		this.repo = repo
	}

	async getAll(payload: ClientGetAllRequest): Promise<ClientGetAllResponse | ClientGetOneResponse[]> {
		return this.repo.getAll(payload)
	}

	async getOneById(payload: ClientGetOneByIdRequest): Promise<ClientGetOneResponse> {
		const client = await this.repo.getOneById(payload)
		if (!client) {
			throw new BadRequestException('client not found')
		}
		return client
	}

	async getOne(payload: ClientGetOneRequest): Promise<ClientGetOneResponse> {
		const client = await this.repo.getOne(payload)

		return client
	}

	async create(payload: ClientCreateRequest): Promise<MutationResponse> {
		const candidate = await this.getOne({ passport: payload.passport })
		if (candidate) {
			const shopExists = await candidate.shops.find((sh) => sh.shop.id === payload.shopId)
			if (shopExists) {
				throw new BadRequestException('client already exists')
			} else {
				await this.repo.createShopClient({ shopId: payload.shopId, clientId: candidate.id })
				return { id: candidate.id }
			}
		}
		const client = await this.repo.create(payload)
		await this.repo.createShopClient({ shopId: payload.shopId, clientId: client.id })

		return client
	}

	async update(param: ClientGetOneByIdRequest, payload: ClientUpdateRequest): Promise<MutationResponse> {
		await this.getOneById(param)

		if (payload.passport) {
			const candidate = await this.getOne({ passport: payload.passport })
			if (candidate && candidate.id !== param.id) {
				throw new BadRequestException('passport already exists')
			}
		}
		return this.repo.update({ ...param, ...payload })
	}

	async delete(payload: ClientDeleteRequest): Promise<MutationResponse> {
		await this.getOneById(payload)

		return this.repo.delete(payload)
	}
}
