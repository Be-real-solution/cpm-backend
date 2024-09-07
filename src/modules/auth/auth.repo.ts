import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma'
import { AdminGetOneRequest, AdminGetOneResponse } from '../admin/interfaces'
import { ShopGetOneRequest, ShopGetOneResponse } from '../shop/interfaces'

@Injectable()
export class AuthRepo {
	private readonly prisma: PrismaService
	constructor(prisma: PrismaService) {
		this.prisma = prisma
	}

	async adminGetOne(payload: AdminGetOneRequest): Promise<AdminGetOneResponse & { password: string }> {
		const admin = await this.prisma.admin.findFirst({
			where: {
				deletedAt: null,
				fullName: payload.fullName,
				username: payload.username,
			},
			select: { createdAt: true, fullName: true, id: true, type: true, password: true, isMain: true, username: true },
		})

		return admin
	}

	async shopGetOne(payload: ShopGetOneRequest): Promise<ShopGetOneResponse & { password: string }> {
		const admin = await this.prisma.shop.findFirst({
			where: {
				deletedAt: null,
				username: payload.username,
			},
			select: {
				createdAt: true,
				accountable: true,
				address: true,
				director: true,
				id: true,
				isActive: true,
				manager: true,
				monthlyPay: true,
				name: true,
				password: true,
				paymentDay: true,
				phone: true,
				username: true,
				secondPhone: true,
			},
		})

		return admin
	}
}
