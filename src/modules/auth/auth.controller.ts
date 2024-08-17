import { Controller } from '@nestjs/common'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
	private readonly service: AuthService
	constructor(service: AuthService) {
		this.service = service
	}
}
