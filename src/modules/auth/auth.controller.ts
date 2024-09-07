import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { AdminSignInRequestDto, AdminSignInResponseDto, ShopSignInRequestDto, ShopSignInResponseDto } from './dtos'
import { AdminSignInResponse, ShopSignInResponse } from './interfaces'

@Controller()
export class AuthController {
	private readonly service: AuthService
	constructor(service: AuthService) {
		this.service = service
	}

	@ApiTags('admin')
	@HttpCode(HttpStatus.OK)
	@Post('admin/sign-in')
	@ApiResponse({ type: AdminSignInResponseDto })
	adminSignIn(@Body() payload: AdminSignInRequestDto): Promise<AdminSignInResponse> {
		return this.service.adminSignIn(payload)
	}

	@ApiTags('shop')
	@HttpCode(HttpStatus.OK)
	@Post('shop/sign-in')
	@ApiResponse({ type: ShopSignInResponseDto })
	shopSignIn(@Body() payload: ShopSignInRequestDto): Promise<ShopSignInResponse> {
		return this.service.shopSignIn(payload)
	}
}
