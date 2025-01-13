import {
	Body,
	Controller,
	Post
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post("refresh-token")
	public refreshToken(@Body() token: RefreshTokenDto) {
		return this.authService.refreshToken(token);
	}

	@ApiOperation({ summary: "login api for admins" })
	@ApiResponse({
		status: 200,
		description: "return access_token and refresh_token with admin fields",
	})
	@Post("admin-login")
	public adminLogin(@Body() dto: LoginDto) {
		return this.authService.adminLogin(dto);
	}

	@ApiOperation({ summary: "login api for stores" })
	@ApiResponse({
		status: 200,
		description: "return access_token and refresh_token with admin fields",
	})
	@Post("store-login")
	public storeLogin(@Body() dto: LoginDto) {
		return this.authService.storeLogin(dto);
	}

}
