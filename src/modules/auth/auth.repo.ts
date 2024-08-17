import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma'

@Injectable()
export class AuthRepo {
	private readonly prisma: PrismaService
	constructor(prisma: PrismaService) {
		this.prisma = prisma
	}
}
