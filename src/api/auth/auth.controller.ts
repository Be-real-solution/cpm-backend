import {
	Body,
	Controller,
	Post
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post("refresh-token")
	public refreshToken(@Body("token") token: string) {
		return this.authService.refreshToken(token);
	}

	@ApiOperation({ summary: "login admin api" })
	@ApiResponse({
		status: 200,
		description: "return access_token and refresh_token with admin fields",
	})
	@Post("login")
	public login(@Body() dto: LoginDto) {
		return this.authService.adminLogin(dto);
	}

}
