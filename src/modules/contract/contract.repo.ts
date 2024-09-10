import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma'
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
export class ContractRepo {
	private readonly prisma: PrismaService
	constructor(prisma: PrismaService) {
		this.prisma = prisma
	}

	async getAll(payload: ContractGetAllRequest & { ids?: string[] }): Promise<ContractGetAllResponse | ContractGetOneResponse[]> {
		let paginationOptions = {}
		if (payload.pagination) {
			paginationOptions = {
				take: payload.pageSize,
				skip: (payload.pageNumber - 1) * payload.pageSize,
			}
		}

		const contracts = await this.prisma.contract.findMany({
			where: {
				deletedAt: null,
				name: { contains: payload.name, mode: 'insensitive' },
				clientId: payload.clientId,
				paymentMethod: payload.paymentMethod,
				status: payload.status,
			},
			select: {
				id: true,
				monthCount: true,
				name: true,
				paymentMethod: true,
				paymentValue: true,
				status: true,
				client: {
					select: {
						id: true,
						address: true,
						birthday: true,
						fathersName: true,
						firstName: true,
						isActive: true,
						phone: true,
						passportAddress: true,
						jshshir: true,
						lastName: true,
						passport: true,
						rating: true,
						secondAddress: true,
						createdAt: true,
					},
				},
				products: {
					select: {
						id: true,
						count: true,
						name: true,
						price: true,
						unitType: true,
						createdAt: true,
					},
				},
				createdAt: true,
			},
			...paginationOptions,
			orderBy: [{ createdAt: 'desc' }],
		})

		if (payload.pagination) {
			const contractsCount = await this.prisma.contract.count({
				where: {
					deletedAt: null,
					name: { contains: payload.name, mode: 'insensitive' },
					clientId: payload.clientId,
					paymentMethod: payload.paymentMethod,
					status: payload.status,
				},
			})

			return {
				pagesCount: Math.ceil(contractsCount / payload.pageSize),
				pageSize: contracts.length,
				data: contracts,
			}
		} else {
			return contracts
		}
	}

	async getOneById(payload: ContractGetOneByIdRequest): Promise<ContractGetOneResponse> {
		const contract = await this.prisma.contract.findFirst({
			where: { deletedAt: null, id: payload.id },
			select: {
				id: true,
				monthCount: true,
				name: true,
				paymentMethod: true,
				paymentValue: true,
				status: true,
				client: {
					select: {
						id: true,
						address: true,
						birthday: true,
						fathersName: true,
						firstName: true,
						isActive: true,
						phone: true,
						passportAddress: true,
						jshshir: true,
						lastName: true,
						passport: true,
						rating: true,
						secondAddress: true,
						createdAt: true,
					},
				},
				products: {
					select: {
						id: true,
						count: true,
						name: true,
						price: true,
						unitType: true,
						createdAt: true,
					},
				},
				createdAt: true,
			},
		})

		return contract
	}

	async getOne(payload: ContractGetOneRequest): Promise<ContractGetOneResponse> {
		const contract = await this.prisma.contract.findFirst({
			where: {
				deletedAt: null,
				clientId: payload.clientId,
				name: payload.name,
				paymentMethod: payload.paymentMethod,
				status: payload.status,
			},
			select: {
				id: true,
				monthCount: true,
				name: true,
				paymentMethod: true,
				paymentValue: true,
				status: true,
				client: {
					select: {
						id: true,
						address: true,
						birthday: true,
						fathersName: true,
						firstName: true,
						isActive: true,
						phone: true,
						passportAddress: true,
						jshshir: true,
						lastName: true,
						passport: true,
						rating: true,
						secondAddress: true,
						createdAt: true,
					},
				},
				products: {
					select: {
						id: true,
						count: true,
						name: true,
						price: true,
						unitType: true,
						createdAt: true,
					},
				},
				createdAt: true,
			},
		})

		return contract
	}

	async create(payload: ContractCreateRequest): Promise<MutationResponse> {
		const contract = await this.prisma.contract.create({
			data: {
				monthCount: payload.monthCount,
				name: payload.name,
				clientId: payload.clientId,
				paymentMethod: payload.paymentMethod,
				paymentValue: payload.paymentValue,
			},
		})
		return { id: contract.id }
	}

	async update(payload: ContractUpdateRequest & ContractGetOneByIdRequest): Promise<MutationResponse> {
		const contract = await this.prisma.contract.update({
			where: { deletedAt: null, id: payload.id },
			data: {
				monthCount: payload.monthCount,
				name: payload.name,
				clientId: payload.clientId,
				paymentMethod: payload.paymentMethod,
				paymentValue: payload.paymentValue,
				status: payload.status,
			},
		})
		return { id: contract.id }
	}

	async delete(payload: ContractDeleteRequest): Promise<MutationResponse> {
		await this.prisma.contract.update({
			where: { deletedAt: null, id: payload.id },
			data: { deletedAt: new Date() },
		})

		return payload
	}
}
