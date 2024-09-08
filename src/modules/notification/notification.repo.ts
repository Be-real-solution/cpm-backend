import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma'
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
export class NotificationRepo {
	private readonly prisma: PrismaService
	constructor(prisma: PrismaService) {
		this.prisma = prisma
	}

	async getAll(payload: NotificationGetAllRequest & { ids?: string[] }): Promise<NotificationGetAllResponse | NotificationGetOneResponse[]> {
		let paginationOptions = {}
		if (payload.pagination) {
			paginationOptions = {
				take: payload.pageSize,
				skip: (payload.pageNumber - 1) * payload.pageSize,
			}
		}

		const notifications = await this.prisma.notification.findMany({
			where: {
				deletedAt: null,
				title: { contains: payload.title, mode: 'insensitive' },
				subtitle: { contains: payload.subtitle, mode: 'insensitive' },
				shops: { some: { shopId: payload.shopId } },
			},
			select: {
				id: true,
				subtitle: true,
				title: true,
				shops: {
					select: {
						id: true,
						read: true,
						shop: {
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
						},
					},
					where: { read: payload.read, deletedAt: null },
				},
				createdAt: true,
			},
			...paginationOptions,
			orderBy: [{ createdAt: 'desc' }],
		})

		if (payload.pagination) {
			const notificationsCount = await this.prisma.notification.count({
				where: {
					deletedAt: null,
					title: { contains: payload.title, mode: 'insensitive' },
					subtitle: { contains: payload.subtitle, mode: 'insensitive' },
					shops: { some: { shopId: payload.shopId } },
				},
			})

			return {
				pagesCount: Math.ceil(notificationsCount / payload.pageSize),
				pageSize: notifications.length,
				data: notifications,
			}
		} else {
			return notifications
		}
	}

	async getOneById(payload: NotificationGetOneByIdRequest): Promise<NotificationGetOneResponse> {
		const notification = await this.prisma.notification.findFirst({
			where: { deletedAt: null, id: payload.id },
			select: {
				id: true,
				subtitle: true,
				title: true,
				shops: {
					select: {
						id: true,
						read: true,
						shop: {
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
						},
					},
					where: { deletedAt: null },
				},
				createdAt: true,
			},
		})

		return notification
	}

	async getOne(payload: NotificationGetOneRequest): Promise<NotificationGetOneResponse> {
		const notification = await this.prisma.notification.findFirst({
			where: {
				deletedAt: null,
				title: payload.title,
				subtitle: payload.subtitle,
				shops: { some: { shopId: payload.shopId } },
			},
			select: {
				id: true,
				subtitle: true,
				title: true,
				shops: {
					select: {
						id: true,
						read: true,
						shop: {
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
						},
					},
					where: { deletedAt: null },
				},
				createdAt: true,
			},
		})

		return notification
	}

	async create(payload: NotificationCreateRequest): Promise<MutationResponse> {
		const shops = await this.prisma.shop.findMany({ where: { id: { in: payload.shopIds } } })
		const notification = await this.prisma.notification.create({
			data: {
				title: payload.title,
				subtitle: payload.subtitle,
				shops: {
					createMany: {
						data: shops.map((sh) => ({ shopId: sh.id })),
					},
				},
			},
		})
		return { id: notification.id }
	}

	async update(payload: NotificationUpdateRequest & NotificationGetOneByIdRequest): Promise<MutationResponse> {
		const shops = payload.shopIds?.length ? await this.prisma.shop.findMany({ where: { id: { in: payload.shopIds } } }) : []
		const shopsToRemove = payload.shopIdsToRemove?.length ? await this.prisma.shop.findMany({ where: { id: { in: payload.shopIdsToRemove } } }) : []

		const notification = await this.prisma.notification.update({
			where: { deletedAt: null, id: payload.id },
			data: {
				title: payload.title,
				subtitle: payload.subtitle,
				shops: {
					createMany: {
						data: shops.map((sh) => ({ shopId: sh.id })),
					},
					deleteMany: {
						shopId: { in: shopsToRemove.map((sh) => sh.id) },
					},
				},
			},
		})
		return { id: notification.id }
	}

	async delete(payload: NotificationDeleteRequest): Promise<MutationResponse> {
		await this.prisma.notification.update({
			where: { deletedAt: null, id: payload.id },
			data: {
				deletedAt: new Date(),
				shops: {
					updateMany: {
						where: { notificationId: payload.id },
						data: { deletedAt: new Date() },
					},
				},
			},
		})

		return payload
	}
}
