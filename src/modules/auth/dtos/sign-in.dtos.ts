import { ApiProperty } from '@nestjs/swagger'
import { AdminGetOneResponse } from '../../admin/interfaces'
import { AdminSignInRequest, AdminSignInResponse, ShopSignInRequest, ShopSignInResponse, Tokens } from '../interfaces'
import { IsNotEmpty, IsString } from 'class-validator'
import { AdminGetOneResponseDto } from '../../admin/dtos'
import { ShopGetOneResponse } from '../../shop/interfaces'

export class AdminSignInRequestDto implements AdminSignInRequest {
	@ApiProperty({ type: String })
	@IsString()
	@IsNotEmpty()
	username: string

	@ApiProperty({ type: String })
	@IsString()
	@IsNotEmpty()
	password: string
}

export class ShopSignInRequestDto implements ShopSignInRequest {
	@ApiProperty({ type: String })
	@IsString()
	@IsNotEmpty()
	username: string

	@ApiProperty({ type: String })
	@IsString()
	@IsNotEmpty()
	password: string
}

export class TokensDto implements Tokens {
	@ApiProperty({ type: String, example: 'eyjfjifgdfg' })
	accessToken: string

	@ApiProperty({ type: String, example: 'eyjfjifgdfg' })
	refreshToken: string
}

export class AdminSignInResponseDto implements AdminSignInResponse {
	@ApiProperty({ type: AdminGetOneResponseDto })
	admin: AdminGetOneResponse

	@ApiProperty({ type: TokensDto })
	tokens: Tokens
}

export class ShopSignInResponseDto implements ShopSignInResponse {
	@ApiProperty({ type: AdminGetOneResponseDto })
	shop: ShopGetOneResponse

	@ApiProperty({ type: TokensDto })
	tokens: Tokens
}
