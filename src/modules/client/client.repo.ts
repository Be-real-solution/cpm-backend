import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma'
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
export class ClientRepo {
	private readonly prisma: PrismaService
	constructor(prisma: PrismaService) {
		this.prisma = prisma
	}

	async getAll(payload: ClientGetAllRequest & { ids?: string[] }): Promise<ClientGetAllResponse | ClientGetOneResponse[]> {
		let paginationOptions = {}
		if (payload.pagination) {
			paginationOptions = {
				take: payload.pageSize,
				skip: (payload.pageNumber - 1) * payload.pageSize,
			}
		}

		const clients = await this.prisma.client.findMany({
			where: {
				deletedAt: null,
				firstName: { contains: payload.firstName, mode: 'insensitive' },
				lastName: { contains: payload.lastName, mode: 'insensitive' },
				address: { contains: payload.address, mode: 'insensitive' },
				secondAddress: { contains: payload.secondAddress, mode: 'insensitive' },
				phone: { contains: payload.phone, mode: 'insensitive' },
				passport: { contains: payload.passport, mode: 'insensitive' },
				isActive: payload.isActive,
			},
			select: {
				id: true,
				address: true,
				birthday: true,
				isActive: true,
				firstName: true,
				lastName: true,
				passport: true,
				phone: true,
				rating: true,
				secondAddress: true,
				createdAt: true,
			},
			...paginationOptions,
			orderBy: [{ createdAt: 'desc' }],
		})

		if (payload.pagination) {
			const clientsCount = await this.prisma.client.count({
				where: {
					deletedAt: null,
					firstName: { contains: payload.firstName, mode: 'insensitive' },
					lastName: { contains: payload.lastName, mode: 'insensitive' },
					address: { contains: payload.address, mode: 'insensitive' },
					secondAddress: { contains: payload.secondAddress, mode: 'insensitive' },
					phone: { contains: payload.phone, mode: 'insensitive' },
					passport: { contains: payload.passport, mode: 'insensitive' },
					isActive: payload.isActive,
				},
			})

			return {
				pagesCount: Math.ceil(clientsCount / payload.pageSize),
				pageSize: clients.length,
				data: clients,
			}
		} else {
			return clients
		}
	}

	async getOneById(payload: ClientGetOneByIdRequest): Promise<ClientGetOneResponse> {
		const client = await this.prisma.client.findFirst({
			where: { deletedAt: null, id: payload.id },
			select: {
				id: true,
				address: true,
				birthday: true,
				isActive: true,
				firstName: true,
				lastName: true,
				passport: true,
				phone: true,
				rating: true,
				secondAddress: true,
				createdAt: true,
			},
		})

		return client
	}

	async getOne(payload: ClientGetOneRequest): Promise<ClientGetOneResponse> {
		const client = await this.prisma.client.findFirst({
			where: {
				deletedAt: null,
				firstName: payload.firstName,
				id: payload.id,
				lastName: payload.lastName,
				phone: payload.phone,
				passport: payload.passport,
				address: payload.address,
				secondAddress: payload.secondAddress,
				isActive: payload.isActive,
				rating: payload.rating,
			},
			select: {
				id: true,
				address: true,
				birthday: true,
				isActive: true,
				firstName: true,
				lastName: true,
				passport: true,
				phone: true,
				rating: true,
				secondAddress: true,
				createdAt: true,
			},
		})

		return client
	}

	async create(payload: ClientCreateRequest): Promise<MutationResponse> {
		const client = await this.prisma.client.create({
			data: {
				firstName: payload.firstName,
				birthday: payload.birthday,
				lastName: payload.lastName,
				passport: payload.passport,
				phone: payload.phone,
				address: payload.address,
				secondAddress: payload.secondAddress,
			},
		})
		return client
	}

	async update(payload: ClientUpdateRequest & ClientGetOneByIdRequest): Promise<MutationResponse> {
		const client = await this.prisma.client.update({
			where: { deletedAt: null, id: payload.id },
			data: {
				firstName: payload.firstName,
				birthday: payload.birthday,
				lastName: payload.lastName,
				passport: payload.passport,
				phone: payload.phone,
				address: payload.address,
				secondAddress: payload.secondAddress,
				isActive: payload.isActive,
			},
		})
		return client
	}

	async delete(payload: ClientDeleteRequest): Promise<MutationResponse> {
		await this.prisma.client.update({
			where: { deletedAt: null, id: payload.id },
			data: { deletedAt: new Date() },
		})

		return payload
	}
}
