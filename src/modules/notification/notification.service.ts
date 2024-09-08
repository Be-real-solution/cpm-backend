import { BadRequestException, Injectable } from '@nestjs/common'
import { NotificationRepo } from './notification.repo'
import {
	NotificationCreateRequest,
	NotificationDeleteRequest,
	NotificationGetAllRequest,
	NotificationGetAllResponse,
	NotificationGetOneByIdRequest,
	NotificationGetOneRequest,
	NotificationGetOneResponse,
	NotificationUpdateRequest,
} from './interfaces'
import { MutationResponse } from '../../interfaces'

@Injectable()
export class NotificationService {
	private readonly repo: NotificationRepo
	constructor(repo: NotificationRepo) {
		this.repo = repo
	}

	async getAll(payload: NotificationGetAllRequest): Promise<NotificationGetAllResponse | NotificationGetOneResponse[]> {
		return this.repo.getAll(payload)
	}

	async getOneById(payload: NotificationGetOneByIdRequest): Promise<NotificationGetOneResponse> {
		const notication = await this.repo.getOneById(payload)
		if (!notication) {
			throw new BadRequestException('notication not found')
		}
		return notication
	}

	async getOne(payload: NotificationGetOneRequest): Promise<NotificationGetOneResponse> {
		const notication = await this.repo.getOne(payload)

		return notication
	}

	async create(payload: NotificationCreateRequest): Promise<MutationResponse> {
		return this.repo.create({ ...payload })
	}

	async update(param: NotificationGetOneByIdRequest, payload: NotificationUpdateRequest): Promise<MutationResponse> {
		await this.getOneById(param)
		return this.repo.update({ ...param, ...payload })
	}

	async delete(payload: NotificationDeleteRequest): Promise<MutationResponse> {
		await this.getOneById(payload)

		return this.repo.delete(payload)
	}
}
