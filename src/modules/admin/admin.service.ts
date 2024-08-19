import { BadRequestException, Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { AdminRepo } from './admin.repo'
import {
	AdminCreateRequest,
	AdminDeleteRequest,
	AdminGetAllRequest,
	AdminGetAllResponse,
	AdminGetOneByIdRequest,
	AdminGetOneRequest,
	AdminGetOneResponse,
	AdminUpdateRequest,
} from './interfaces'
import { MutationResponse } from '../../interfaces'

@Injectable()
export class AdminService {
	private readonly repo: AdminRepo
	constructor(repo: AdminRepo) {
		this.repo = repo
	}

	async getAll(payload: AdminGetAllRequest): Promise<AdminGetAllResponse | AdminGetOneResponse[]> {
		return this.repo.getAll(payload)
	}

	async getOneById(payload: AdminGetOneByIdRequest): Promise<AdminGetOneResponse> {
		const admin = await this.repo.getOneById(payload)
		if (!admin) {
			throw new BadRequestException('admin not found')
		}
		return admin
	}

	async getOne(payload: AdminGetOneRequest): Promise<AdminGetOneResponse> {
		const admin = await this.repo.getOne(payload)

		return admin
	}

	async create(payload: AdminCreateRequest): Promise<MutationResponse> {
		const candidate = await this.getOne({ username: payload.username })
		if (candidate) {
			throw new BadRequestException('username already exists')
		}
		const password = await bcrypt.hash(payload.password, 7)

		return this.repo.create({ ...payload, password: password })
	}

	async update(param: AdminGetOneByIdRequest, payload: AdminUpdateRequest): Promise<MutationResponse> {
		if (payload.username) {
			const candidate = await this.getOne({ username: payload.username })
			if (candidate && candidate.id !== param.id) {
				throw new BadRequestException('username already exists')
			}
		}
		const password = payload.password ? await bcrypt.hash(payload.password, 7) : undefined

		return this.repo.update({ ...param, ...payload, password: password })
	}

	async delete(payload: AdminDeleteRequest): Promise<MutationResponse> {
		return this.repo.delete(payload)
	}
}
