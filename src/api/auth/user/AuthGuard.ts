import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AdminEntity } from "src/core/entity";
import { AuthorizationError } from "../exception";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "../decorator";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
	constructor(private reflector: Reflector) {
		super();
	}

	canActivate(context: ExecutionContext) {
		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass(),
		]);

		if (isPublic) {
			return true;
		}

		return super.canActivate(context);
	}

	handleRequest<T = AdminEntity>(
		error: unknown,
		user: T,
		info: any,
		context: ExecutionContext,
	): T {
		if (error || !user) {
			throw error || new AuthorizationError();
		}

		return user;
	}
}

// import { AuthGuard } from "@nestjs/passport";
// import { ExecutionContext, Injectable } from "@nestjs/common";
// import { AuthorizationError } from "../exception";
// import { UserEntity } from "src/core/entity";
// import { JwtToken } from "src/infrastructure/lib/jwt-token";
// import { UserService } from "src/api/user/user.service";
// import { AuthPayload } from "src/common/type";
// import { Response } from "express";
// import { config } from "src/config";

// @Injectable()
// export class JwtAuthGuard extends AuthGuard("jwt") {
// 	constructor(
// 		private readonly jwtService: JwtToken,
// 		private userService: UserService,
// 	) {
// 		super();
// 	}

// 	async canActivate(context: ExecutionContext): Promise<boolean> {
// 		const req = context.switchToHttp().getRequest();
// 		const res: Response = context.switchToHttp().getResponse();

// 		try {
//       await super.canActivate(context);
// 			return true;
// 		} catch (err: any) {
//       console.log(12, err);
// 			if (err.status === 401) {
// 				const refreshToken = req.cookies["refresh_token"];

// 				if (!refreshToken) {
// 					throw new AuthorizationError();
// 				}

// 				const payload: AuthPayload = await this.jwtService.verifyRefresh(refreshToken);

// 				const {data: user} = await this.userService.findOneById(payload.id, "eng", {
// 					where: { role: payload.role },
// 				});

// 				if (!user) {
// 					throw new AuthorizationError();
// 				}

// 				const token = await this.jwtService.generateToken(user);

// 				// Yangi access tokenni response cookiesiga qo'shish
// 				res.cookie("refresh_token", token.refresh_token, {
// 					httpOnly: true,
// 					// secure: true, // HTTPS orqali jo'natilishi kerak
// 					sameSite: "strict",
//           maxAge: Date.now() + config.COOKIE_AGE * 24 * 60 * 60 * 1000, // 1 kun (millisekundlarda)
// 				});

// 				req.headers["Authorization"] = `Bearer ${token.access_token}`;
//         console.log(22222222);

// 				return true;
// 			}

// 			throw new AuthorizationError();
// 		}
// 	}

// 	handleRequest<T = UserEntity>(
// 		error: unknown,
// 		user: T,
// 		info: any,
// 		context: ExecutionContext,
// 	): T {
// 		if (error || !user) {
// 			throw error || new AuthorizationError();
// 		}
// 		return user;
// 	}
// }
