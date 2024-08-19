import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma'
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
export class ShopRepo {
	private readonly prisma: PrismaService
	constructor(prisma: PrismaService) {
		this.prisma = prisma
	}

	async getAll(payload: ShopGetAllRequest & { ids?: string[] }): Promise<ShopGetAllResponse | ShopGetOneResponse[]> {
		let paginationOptions = {}
		if (payload.pagination) {
			paginationOptions = {
				take: payload.pageSize,
				skip: (payload.pageNumber - 1) * payload.pageSize,
			}
		}

		const shops = await this.prisma.shop.findMany({
			where: {
				deletedAt: null,
				name: { contains: payload.name, mode: 'insensitive' },
				phone: { contains: payload.phone, mode: 'insensitive' },
				address: { contains: payload.address, mode: 'insensitive' },
				manager: { contains: payload.manager, mode: 'insensitive' },
				username: { contains: payload.username, mode: 'insensitive' },
				director: { contains: payload.director, mode: 'insensitive' },
				isActive: payload.isActive,
				paymentDay: payload.paymentDay,
				monthlyPay: payload.monthlyPay,
				accountable: { contains: payload.accountable, mode: 'insensitive' },
				secondPhone: { contains: payload.secondPhone, mode: 'insensitive' },
			},
			select: {
				id: true,
				address: true,
				isActive: true,
				phone: true,
				accountable: true,
				director: true,
				manager: true,
				monthlyPay: true,
				name: true,
				paymentDay: true,
				secondPhone: true,
				username: true,
				createdAt: true,
			},
			...paginationOptions,
			orderBy: [{ createdAt: 'desc' }],
		})

		if (payload.pagination) {
			const shopsCount = await this.prisma.shop.count({
				where: {
					deletedAt: null,
					name: { contains: payload.name, mode: 'insensitive' },
					phone: { contains: payload.phone, mode: 'insensitive' },
					address: { contains: payload.address, mode: 'insensitive' },
					manager: { contains: payload.manager, mode: 'insensitive' },
					username: { contains: payload.username, mode: 'insensitive' },
					director: { contains: payload.director, mode: 'insensitive' },
					isActive: payload.isActive,
					paymentDay: payload.paymentDay,
					monthlyPay: payload.monthlyPay,
					accountable: { contains: payload.accountable, mode: 'insensitive' },
					secondPhone: { contains: payload.secondPhone, mode: 'insensitive' },
				},
			})

			return {
				pagesCount: Math.ceil(shopsCount / payload.pageSize),
				pageSize: shops.length,
				data: shops,
			}
		} else {
			return shops
		}
	}

	async getOneById(payload: ShopGetOneByIdRequest): Promise<ShopGetOneResponse> {
		const shop = await this.prisma.shop.findFirst({
			where: { deletedAt: null, id: payload.id },
			select: {
				id: true,
				address: true,
				isActive: true,
				phone: true,
				accountable: true,
				director: true,
				manager: true,
				monthlyPay: true,
				name: true,
				paymentDay: true,
				secondPhone: true,
				username: true,
				createdAt: true,
			},
		})

		return shop
	}

	async getOne(payload: ShopGetOneRequest): Promise<ShopGetOneResponse> {
		const shop = await this.prisma.shop.findFirst({
			where: {
				deletedAt: null,
				accountable: payload.accountable,
				address: payload.address,
				manager: payload.manager,
				director: payload.director,
				monthlyPay: payload.monthlyPay,
				name: payload.name,
				phone: payload.phone,
				username: payload.username,
				paymentDay: payload.paymentDay,
				secondPhone: payload.secondPhone,
				isActive: payload.isActive,
			},
			select: {
				id: true,
				address: true,
				isActive: true,
				phone: true,
				accountable: true,
				director: true,
				manager: true,
				monthlyPay: true,
				name: true,
				paymentDay: true,
				secondPhone: true,
				username: true,
				createdAt: true,
			},
		})

		return shop
	}

	async create(payload: ShopCreateRequest): Promise<MutationResponse> {
		const shop = await this.prisma.shop.create({
			data: {
				accountable: payload.accountable,
				address: payload.address,
				manager: payload.manager,
				director: payload.director,
				monthlyPay: payload.monthlyPay,
				name: payload.name,
				password: payload.password,
				phone: payload.phone,
				username: payload.username,
				paymentDay: payload.paymentDay,
				secondPhone: payload.secondPhone,
			},
		})
		return shop
	}

	async update(payload: ShopUpdateRequest & ShopGetOneByIdRequest): Promise<MutationResponse> {
		const shop = await this.prisma.shop.update({
			where: { deletedAt: null, id: payload.id },
			data: {
				accountable: payload.accountable,
				address: payload.address,
				manager: payload.manager,
				director: payload.director,
				monthlyPay: payload.monthlyPay,
				name: payload.name,
				password: payload.password,
				phone: payload.phone,
				username: payload.username,
				paymentDay: payload.paymentDay,
				secondPhone: payload.secondPhone,
				isActive: payload.isActive,
			},
		})
		return shop
	}

	async delete(payload: ShopDeleteRequest): Promise<MutationResponse> {
		await this.prisma.shop.update({
			where: { deletedAt: null, id: payload.id },
			data: { deletedAt: new Date() },
		})

		return payload
	}
}
