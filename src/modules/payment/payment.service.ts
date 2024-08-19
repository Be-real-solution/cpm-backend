import { BadRequestException, Injectable } from '@nestjs/common'
import { PaymentRepo } from './payment.repo'
import {
	PaymentCreateRequest,
	PaymentGetAllRequest,
	PaymentGetAllResponse,
	PaymentGetOneByIdRequest,
	PaymentGetOneRequest,
	PaymentGetOneResponse,
	PaymentMonthlyGetAllRequest,
	PaymentMonthlyGetAllResponse,
	PaymentMonthlyGetOneByIdRequest,
	PaymentMonthlyGetOneRequest,
	PaymentMonthlyGetOneResponse,
} from './interfaces'
import { MutationResponse } from '../../interfaces'
import { Cron } from '@nestjs/schedule'

@Injectable()
export class PaymentService {
	private readonly repo: PaymentRepo
	constructor(repo: PaymentRepo) {
		this.repo = repo
	}

	async getAll(payload: PaymentGetAllRequest): Promise<PaymentGetAllResponse | PaymentGetOneResponse[]> {
		return this.repo.getAll(payload)
	}

	async getOneById(payload: PaymentGetOneByIdRequest): Promise<PaymentGetOneResponse> {
		const payment = await this.repo.getOneById(payload)
		if (!payment) {
			throw new BadRequestException('payment not found')
		}
		return payment
	}

	async getOne(payload: PaymentGetOneRequest): Promise<PaymentGetOneResponse> {
		const payment = await this.repo.getOne(payload)

		return payment
	}

	async create(payload: PaymentCreateRequest): Promise<MutationResponse> {
		return this.repo.create({ ...payload })
	}

	@Cron('0 0 5,15,25 * *')
	async checkAndCreate() {
		await this.repo.createEveryTenDay().catch((e) => {
			console.log(e)
		})
	}

	//==

	async getAllMonthly(payload: PaymentMonthlyGetAllRequest): Promise<PaymentMonthlyGetAllResponse | PaymentMonthlyGetOneResponse[]> {
		return this.repo.getAllMonthly(payload)
	}

	async getOneMonthlyById(payload: PaymentMonthlyGetOneByIdRequest): Promise<PaymentMonthlyGetOneResponse> {
		const payment = await this.repo.getOneMonthlyById(payload)
		if (!payment) {
			throw new BadRequestException('payment not found')
		}
		return payment
	}

	async getOneMonthly(payload: PaymentMonthlyGetOneRequest): Promise<PaymentMonthlyGetOneResponse> {
		const payment = await this.repo.getOneMonthly(payload)

		return payment
	}
}
