import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma'
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
export class ContractProductRepo {
	private readonly prisma: PrismaService
	constructor(prisma: PrismaService) {
		this.prisma = prisma
	}

	async getAll(payload: ContractProductGetAllRequest & { ids?: string[] }): Promise<ContractProductGetAllResponse | ContractProductGetOneResponse[]> {
		let paginationOptions = {}
		if (payload.pagination) {
			paginationOptions = {
				take: payload.pageSize,
				skip: (payload.pageNumber - 1) * payload.pageSize,
			}
		}

		const contractProducts = await this.prisma.contractProduct.findMany({
			where: {
				deletedAt: null,
				name: { contains: payload.name, mode: 'insensitive' },
				contractId: payload.contractId,
				unitType: payload.unitType,
			},
			select: {
				id: true,
				contract: {
					select: {
						client: {
							select: {
								address: true,
								birthday: true,
								fathersName: true,
								firstName: true,
								createdAt: true,
								id: true,
								isActive: true,
								jshshir: true,
								lastName: true,
								passport: true,
								passportAddress: true,
								phone: true,
								rating: true,
								secondAddress: true,
							},
						},
						id: true,
						monthCount: true,
						name: true,
						createdAt: true,
						paymentMethod: true,
						paymentValue: true,
						status: true,
					},
				},
				count: true,
				name: true,
				price: true,
				unitType: true,
				createdAt: true,
			},
			...paginationOptions,
			orderBy: [{ createdAt: 'desc' }],
		})

		if (payload.pagination) {
			const contractProductsCount = await this.prisma.contractProduct.count({
				where: {
					deletedAt: null,
					name: { contains: payload.name, mode: 'insensitive' },
					contractId: payload.contractId,
					unitType: payload.unitType,
				},
			})

			return {
				pagesCount: Math.ceil(contractProductsCount / payload.pageSize),
				pageSize: contractProducts.length,
				data: contractProducts,
			}
		} else {
			return contractProducts
		}
	}

	async getOneById(payload: ContractProductGetOneByIdRequest): Promise<ContractProductGetOneResponse> {
		const contractProduct = await this.prisma.contractProduct.findFirst({
			where: { deletedAt: null, id: payload.id },
			select: {
				id: true,
				contract: {
					select: {
						client: {
							select: {
								address: true,
								birthday: true,
								fathersName: true,
								firstName: true,
								createdAt: true,
								id: true,
								isActive: true,
								jshshir: true,
								lastName: true,
								passport: true,
								passportAddress: true,
								phone: true,
								rating: true,
								secondAddress: true,
							},
						},
						id: true,
						monthCount: true,
						name: true,
						createdAt: true,
						paymentMethod: true,
						paymentValue: true,
						status: true,
					},
				},
				count: true,
				name: true,
				price: true,
				unitType: true,
				createdAt: true,
			},
		})

		return contractProduct
	}

	async getOne(payload: ContractProductGetOneRequest): Promise<ContractProductGetOneResponse> {
		const contractProduct = await this.prisma.contractProduct.findFirst({
			where: {
				deletedAt: null,
				contractId: payload.contractId,
				count: payload.count,
				price: payload.price,
				name: payload.name,
				unitType: payload.unitType,
			},
			select: {
				id: true,
				contract: {
					select: {
						client: {
							select: {
								address: true,
								birthday: true,
								fathersName: true,
								firstName: true,
								createdAt: true,
								id: true,
								isActive: true,
								jshshir: true,
								lastName: true,
								passport: true,
								passportAddress: true,
								phone: true,
								rating: true,
								secondAddress: true,
							},
						},
						id: true,
						monthCount: true,
						name: true,
						createdAt: true,
						paymentMethod: true,
						paymentValue: true,
						status: true,
					},
				},
				count: true,
				name: true,
				price: true,
				unitType: true,
				createdAt: true,
			},
		})

		return contractProduct
	}

	async create(payload: ContractProductCreateRequest): Promise<MutationResponse> {
		const contractProduct = await this.prisma.contractProduct.create({
			data: {
				name: payload.name,
				contractId: payload.contractId,
				count: payload.count,
				price: payload.price,
				unitType: payload.unitType,
			},
		})
		return { id: contractProduct.id }
	}

	async update(payload: ContractProductUpdateRequest & ContractProductGetOneByIdRequest): Promise<MutationResponse> {
		const contractProduct = await this.prisma.contractProduct.update({
			where: { deletedAt: null, id: payload.id },
			data: {
				name: payload.name,
				contractId: payload.contractId,
				count: payload.count,
				price: payload.price,
				unitType: payload.unitType,
			},
		})
		return { id: contractProduct.id }
	}

	async delete(payload: ContractProductDeleteRequest): Promise<MutationResponse> {
		await this.prisma.contractProduct.update({
			where: { deletedAt: null, id: payload.id },
			data: { deletedAt: new Date() },
		})

		return payload
	}
}
