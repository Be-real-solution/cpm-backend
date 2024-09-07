import { AdminGetOneResponse } from '../../admin/interfaces'
import { ShopGetOneResponse } from '../../shop/interfaces'

export declare interface AdminSignInRequest {
	username: string
	password: string
}

export declare interface ShopSignInRequest {
	username: string
	password: string
}

export declare interface Tokens {
	accessToken: string
	refreshToken: string
}
export declare interface AdminSignInResponse {
	admin: AdminGetOneResponse
	tokens: Tokens
}

export declare interface ShopSignInResponse {
	shop: ShopGetOneResponse
	tokens: Tokens
}
