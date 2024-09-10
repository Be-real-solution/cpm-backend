import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma'
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

@Injectable()
export class PaymentRepo {
	private readonly prisma: PrismaService
	constructor(prisma: PrismaService) {
		this.prisma = prisma
	}

	async getAll(payload: PaymentGetAllRequest & { ids?: string[] }): Promise<PaymentGetAllResponse | PaymentGetOneResponse[]> {
		let paginationOptions = {}
		if (payload.pagination) {
			paginationOptions = {
				take: payload.pageSize,
				skip: (payload.pageNumber - 1) * payload.pageSize,
			}
		}

		const payments = await this.prisma.payment.findMany({
			where: { deletedAt: null, shopId: payload.shopId },
			select: {
				id: true,
				sum: true,
				createdAt: true,
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
						contractFile: true,
						createdAt: true,
					},
				},
			},
			...paginationOptions,
			orderBy: [{ createdAt: 'desc' }],
		})

		if (payload.pagination) {
			const paymentsCount = await this.prisma.payment.count({
				where: { deletedAt: null, shopId: payload.shopId },
			})

			return {
				pagesCount: Math.ceil(paymentsCount / payload.pageSize),
				pageSize: payments.length,
				data: payments,
			}
		} else {
			return payments
		}
	}

	async getOneById(payload: PaymentGetOneByIdRequest): Promise<PaymentGetOneResponse> {
		const payment = await this.prisma.payment.findFirst({
			where: { deletedAt: null, id: payload.id },
			select: {
				id: true,
				sum: true,
				createdAt: true,
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
						contractFile: true,
						createdAt: true,
					},
				},
			},
		})

		return payment
	}

	async getOne(payload: PaymentGetOneRequest): Promise<PaymentGetOneResponse> {
		const payment = await this.prisma.payment.findFirst({
			where: { deletedAt: null, shopId: payload.shopId },
			select: {
				id: true,
				sum: true,
				createdAt: true,
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
						contractFile: true,
						createdAt: true,
					},
				},
			},
		})

		return payment
	}

	async create(payload: PaymentCreateRequest): Promise<MutationResponse> {
		const promises = []

		const shop = await this.prisma.shop.findFirst({ where: { deletedAt: null, id: payload.shopId } })
		if (!shop) {
			throw new BadRequestException('shop not found')
		}

		const payment0 = await this.prisma.payment.create({ data: { shopId: payload.shopId, sum: payload.sum } })

		const shopPayments = await this.prisma.shopPayment.findMany({
			where: {
				deletedAt: null,
				shopId: payload.shopId,
				isPaidFull: false,
			},
			select: {
				id: true,
				forMonth: true,
				forYear: true,
				isPaidFull: true,
				monthlyPay: true,
				paymentParts: { select: { id: true, sum: true } },
			},
			orderBy: [{ forYear: 'asc' }, { forMonth: 'asc' }],
		})

		let totalMoney = payload.sum

		for (const payment of shopPayments) {
			if (totalMoney) {
				const payedSum = payment.paymentParts.reduce((a, b) => a + b.sum, 0)
				if (payedSum < payment.monthlyPay) {
					const mustPay = (payment.monthlyPay = payedSum)
					if (totalMoney >= mustPay) {
						promises.push(this.prisma.paymentPart.create({ data: { paymentId: payment0.id, sum: mustPay, shopPaymentId: payment.id } }))
						promises.push(this.prisma.shopPayment.update({ where: { id: payment.id }, data: { isPaidFull: true } }))
						totalMoney = totalMoney - mustPay
					} else {
						promises.push(this.prisma.paymentPart.create({ data: { paymentId: payment0.id, sum: totalMoney, shopPaymentId: payment.id } }))
						totalMoney = 0
					}
				} else {
					promises.push(this.prisma.shopPayment.update({ where: { id: payment.id }, data: { isPaidFull: true } }))
				}
			} else {
				break
			}
		}

		const lastPayment = await this.prisma.shopPayment.findFirst({
			where: {
				deletedAt: null,
				shopId: payload.shopId,
			},
			select: {
				id: true,
				forMonth: true,
				forYear: true,
				isPaidFull: true,
				monthlyPay: true,
				paymentParts: { select: { id: true, sum: true } },
			},
			orderBy: [{ forYear: 'desc' }, { forMonth: 'desc' }],
		})

		if (totalMoney) {
			let lastYear = shopPayments[shopPayments.length - 1]?.forYear || lastPayment?.forYear || shop.createdAt.getFullYear()
			let lastMonth =
				shopPayments[shopPayments.length - 1]?.forMonth || lastPayment?.forMonth || shop.createdAt.getDate() > 10
					? shop.createdAt.getMonth() + 1
					: shop.createdAt.getMonth()
			const forMonth = Math.ceil(totalMoney / shop.monthlyPay)
			for (let i = 0; i < forMonth; i++) {
				if (lastMonth === 12) {
					lastMonth = 1
					lastYear = lastYear + 1
				} else {
					lastMonth = lastMonth + 1
				}
				const isPaidFull = totalMoney >= shop.monthlyPay
				const willPaYed = totalMoney >= shop.monthlyPay ? shop.monthlyPay : totalMoney
				totalMoney = totalMoney >= shop.monthlyPay ? totalMoney - shop.monthlyPay : 0
				promises.push(
					this.prisma.shopPayment.create({
						data: {
							forMonth: lastMonth,
							forYear: lastYear,
							monthlyPay: shop.monthlyPay,
							isPaidFull: isPaidFull,
							shopId: shop.id,
							paymentParts: {
								create: { sum: willPaYed, paymentId: payment0.id },
							},
						},
					}),
				)
			}
		}

		await Promise.all(promises)

		return { id: payment0.id }
	}

	async createEveryTenDay(): Promise<void> {
		const shops = await this.prisma.shop.findMany({ where: { deletedAt: null, isActive: true } })
		const month = new Date().getMonth() + 1
		const year = new Date().getFullYear()

		const shopPayments = await this.prisma.shopPayment.findMany({
			where: {
				deletedAt: null,
				shopId: { in: shops.map((sh) => sh.id) },
				forMonth: month,
				forYear: year,
			},
		})
		const existShopIds = shopPayments.map((sh) => sh.shopId)
		const filteredShops = shops.filter((sh) => !existShopIds.includes(sh.id))

		if (filteredShops.length) {
			await this.prisma.shopPayment.createMany({
				data: filteredShops.map((sh) => ({
					forMonth: month,
					forYear: year,
					shopId: sh.id,
					monthlyPay: sh.monthlyPay,
				})),
			})
		}
		console.log('Payments successfully created')
	}

	//=====================

	async getAllMonthly(payload: PaymentMonthlyGetAllRequest & { ids?: string[] }): Promise<PaymentMonthlyGetAllResponse | PaymentMonthlyGetOneResponse[]> {
		let paginationOptions = {}
		if (payload.pagination) {
			paginationOptions = {
				take: payload.pageSize,
				skip: (payload.pageNumber - 1) * payload.pageSize,
			}
		}

		const payments = await this.prisma.shopPayment.findMany({
			where: {
				deletedAt: null,
				forMonth: payload.forMonth,
				forYear: payload.forYear,
				monthlyPay: payload.monthlyPay,
				shopId: payload.shopId,
			},
			select: {
				id: true,
				forMonth: true,
				forYear: true,
				monthlyPay: true,
				paymentParts: { select: { sum: true } },
				createdAt: true,
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
						contractFile: true,
						createdAt: true,
					},
				},
			},
			...paginationOptions,
			orderBy: [{ createdAt: 'desc' }],
		})

		if (payload.pagination) {
			const paymentsCount = await this.prisma.shopPayment.count({
				where: {
					deletedAt: null,
					forMonth: payload.forMonth,
					forYear: payload.forYear,
					monthlyPay: payload.monthlyPay,
					shopId: payload.shopId,
				},
			})

			return {
				pagesCount: Math.ceil(paymentsCount / payload.pageSize),
				pageSize: payments.length,
				data: payments.map((p) => ({ ...p, sum: p.paymentParts.reduce((a, b) => a + b.sum, 0) })),
			}
		} else {
			return payments.map((p) => ({ ...p, sum: p.paymentParts.reduce((a, b) => a + b.sum, 0) }))
		}
	}

	async getOneMonthlyById(payload: PaymentMonthlyGetOneByIdRequest): Promise<PaymentMonthlyGetOneResponse> {
		const payment = await this.prisma.shopPayment.findFirst({
			where: { deletedAt: null, id: payload.id },
			select: {
				id: true,
				forMonth: true,
				forYear: true,
				monthlyPay: true,
				paymentParts: { select: { sum: true } },
				createdAt: true,
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
						contractFile: true,
						createdAt: true,
					},
				},
			},
		})

		return { ...payment, sum: payment.paymentParts.reduce((a, b) => a + b.sum, 0) }
	}

	async getOneMonthly(payload: PaymentMonthlyGetOneRequest): Promise<PaymentMonthlyGetOneResponse> {
		const payment = await this.prisma.shopPayment.findFirst({
			where: {
				deletedAt: null,
				forMonth: payload.forMonth,
				forYear: payload.forYear,
				monthlyPay: payload.monthlyPay,
				shopId: payload.shopId,
			},
			select: {
				id: true,
				forMonth: true,
				forYear: true,
				monthlyPay: true,
				paymentParts: { select: { sum: true } },
				createdAt: true,
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
						contractFile: true,
						createdAt: true,
					},
				},
			},
		})

		return { ...payment, sum: payment.paymentParts.reduce((a, b) => a + b.sum, 0) }
	}
}
