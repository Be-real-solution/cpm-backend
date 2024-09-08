import { BadRequestException, Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { ShopRepo } from './shop.repo'
import {
	ShopCreateRequest,
	ShopDeleteRequest,
	ShopGetAllRequest,
	ShopGetAllResponse,
	ShopGetOneByIdRequest,
	ShopGetOneRequest,
	ShopGetOneResponse,
	ShopUpdateRequest,
} from './interfaces'
import { MutationResponse } from '../../interfaces'

@Injectable()
export class ShopService {
	private readonly repo: ShopRepo
	constructor(repo: ShopRepo) {
		this.repo = repo
	}

	async getAll(payload: ShopGetAllRequest): Promise<ShopGetAllResponse | ShopGetOneResponse[]> {
		return this.repo.getAll(payload)
	}

	async getOneById(payload: ShopGetOneByIdRequest): Promise<ShopGetOneResponse> {
		const shop = await this.repo.getOneById(payload)
		if (!shop) {
			throw new BadRequestException('shop not found')
		}
		return shop
	}

	async getOne(payload: ShopGetOneRequest): Promise<ShopGetOneResponse> {
		const shop = await this.repo.getOne(payload)

		return shop
	}

	async create(payload: ShopCreateRequest): Promise<MutationResponse> {
		const candidate = await this.getOne({ username: payload.username })
		if (candidate) {
			throw new BadRequestException('username already exists')
		}
		const password = await bcrypt.hash(payload.password, 7)

		return this.repo.create({ ...payload, password: password })
	}

	async update(param: ShopGetOneByIdRequest, payload: ShopUpdateRequest): Promise<MutationResponse> {
		await this.getOneById(param)

		if (payload.username) {
			const candidate = await this.getOne({ username: payload.username })
			if (candidate && candidate.id !== param.id) {
				throw new BadRequestException('username already exists')
			}
		}
		const password = payload.password ? await bcrypt.hash(payload.password, 7) : undefined

		return this.repo.update({ ...param, ...payload, password: password })
	}

	async delete(payload: ShopDeleteRequest): Promise<MutationResponse> {
		await this.getOneById(payload)
		return this.repo.delete(payload)
	}
}
