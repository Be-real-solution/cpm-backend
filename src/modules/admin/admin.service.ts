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
		let isMain = false
		let type = payload.type
		const adminExists = await this.getOne({})
		if (!adminExists) {
			isMain = true
			type = 'super'
		}
		const password = await bcrypt.hash(payload.password, 7)
		return this.repo.create({ ...payload, password: password, isMain: isMain, type: type })
	}

	async update(param: AdminGetOneByIdRequest, payload: AdminUpdateRequest, userId: string): Promise<MutationResponse> {
		const admin = await this.getOneById(param)
		const adminUser = await this.getOneById({ id: userId })
		if (adminUser.type === 'admin' && adminUser.id !== param.id) {
			throw new BadRequestException('You are not allowed to update admin')
		}
		if (adminUser.type === 'super' && admin.type === 'super' && adminUser.id !== param.id) {
			throw new BadRequestException('You cannot update super admin')
		}
		if (admin.isMain && adminUser.id !== param.id) {
			throw new BadRequestException('You cannot update this admin')
		}

		if (payload.username) {
			const candidate = await this.getOne({ username: payload.username })
			if (candidate && candidate.id !== param.id) {
				throw new BadRequestException('username already exists')
			}
		}
		const password = payload.password ? await bcrypt.hash(payload.password, 7) : undefined

		return this.repo.update({ ...param, ...payload, password: password })
	}

	async delete(payload: AdminDeleteRequest, userId: string): Promise<MutationResponse> {
		const admin = await this.getOneById(payload)
		const adminUser = await this.getOneById({ id: userId })
		if (adminUser.type === 'admin' && adminUser.id !== payload.id) {
			throw new BadRequestException('You are not allowed to delete admin')
		}
		if (adminUser.type === 'super' && admin.type === 'super') {
			throw new BadRequestException('You cannot remove super admin')
		}
		if (admin.isMain) {
			throw new BadRequestException('You cannot delete this admin')
		}
		return this.repo.delete(payload)
	}
}
