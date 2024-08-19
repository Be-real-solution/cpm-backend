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
			throw new BadRequestException('passport already exists')
		}
		return this.repo.create(payload)
	}

	async update(param: ClientGetOneByIdRequest, payload: ClientUpdateRequest): Promise<MutationResponse> {
		if (payload.passport) {
			const candidate = await this.getOne({ passport: payload.passport })
			if (candidate && candidate.id !== param.id) {
				throw new BadRequestException('passport already exists')
			}
		}
		return this.repo.update({ ...param, ...payload })
	}

	async delete(payload: ClientDeleteRequest): Promise<MutationResponse> {
		return this.repo.delete(payload)
	}
}
