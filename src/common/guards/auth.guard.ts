import { Request } from 'express'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private readonly jwtService: JwtService, private readonly config: ConfigService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest()
		const token = this.extractTokenFromHeader(request)
		console.log(request.url, request.method)

		// if (!token) {
		// 	throw new UnauthorizedException()
		// }
		// try {
		// 	const payload = await this.jwtService.verifyAsync(token, {
		// 		secret: this.config.getOrThrow('jwt.jwtAccessSecretKey'),
		// 	})

		// 	request['user'] = payload
		// } catch {
		// 	throw new UnauthorizedException()
		// }
		return true
	}

	private extractTokenFromHeader(request: Request): string | undefined {
		const [type, token] = request.headers.authorization?.split(' ') ?? []
		return type === 'Bearer' ? token : undefined
	}
}
