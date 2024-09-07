import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthRepo } from './auth.repo'
import * as bcrypt from 'bcrypt'
import { AdminSignInRequest, AdminSignInResponse, ShopSignInRequest, ShopSignInResponse, Tokens } from './interfaces'
import { JwtService } from '@nestjs/jwt'
import { JwtConfig } from '../../configs'

@Injectable()
export class AuthService {
	private readonly repo: AuthRepo
	private readonly jwtService: JwtService
	constructor(repo: AuthRepo, jwtService: JwtService) {
		this.repo = repo
		this.jwtService = jwtService
	}

	async adminSignIn(payload: AdminSignInRequest): Promise<AdminSignInResponse> {
		const admin = await this.repo.adminGetOne({ username: payload.username })
		if (!admin) {
			throw new UnauthorizedException('admin not found')
		}

		const isCorrect = await bcrypt.compare(payload.password, admin.password)
		if (!isCorrect) {
			throw new UnauthorizedException('admin not found')
		}
		delete admin.password
		const tokens = await this.getTokens({ id: admin.id })
		return { admin: admin, tokens: tokens }
	}

	async shopSignIn(payload: ShopSignInRequest): Promise<ShopSignInResponse> {
		const shop = await this.repo.shopGetOne({ username: payload.username })
		if (!shop) {
			throw new UnauthorizedException('shop not found')
		}

		const isCorrect = await bcrypt.compare(payload.password, shop.password)
		if (!isCorrect) {
			throw new UnauthorizedException('shop not found')
		}

		if (!shop.isActive) {
			throw new BadRequestException('shop not active')
		}
		delete shop.password
		const tokens = await this.getTokens({ id: shop.id })
		return { shop: shop, tokens: tokens }
	}

	private async getTokens(payload: { id: string }): Promise<Tokens> {
		return {
			accessToken: await this.getAccessToken(payload),
			refreshToken: await this.getRefreshToken(payload),
		}
	}

	private async getAccessToken(payload: { id: string }): Promise<string> {
		const accessToken = await this.jwtService.signAsync(payload, {
			secret: JwtConfig.accessToken.key,
			expiresIn: JwtConfig.accessToken.time,
		})

		return accessToken
	}
	private async getRefreshToken(payload: { id: string }): Promise<string> {
		const refreshToken = await this.jwtService.signAsync(payload, {
			secret: JwtConfig.refreshToken.key,
			expiresIn: JwtConfig.refreshToken.time,
		})
		return refreshToken
	}
}
