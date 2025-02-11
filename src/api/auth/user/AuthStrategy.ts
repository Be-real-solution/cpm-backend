import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import { AdminService } from "src/api/admin/admin.service";
import { Roles } from "src/common/database/Enums";
import { AuthPayload } from "src/common/type";
import { config } from "src/config";
import { AdminEntity, StoreEntity } from "src/core/entity";
import { AuthorizationError } from "../exception";
import { StoreService } from "src/api/store/store.service";
import { StoreBlocked } from "../exception/store-blocked";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
	constructor(
		private adminService: AdminService,
		private storeService: StoreService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: config.ACCESS_SECRET_KEY,
			// secretOrKey: config.REFRESH_SECRET_KEY,
			passReqToCallback: true,
		});
	}

	async validate(req: Request, payload: AuthPayload) {
		let user: AdminEntity | StoreEntity | null = null;


		try {
			if (payload.role === Roles.STORE_ADMIN) {
				user = await this.storeService
					.findOneBy("en", {
						where: { id: payload.id },
					})
					.then((res) => res.data);
			} else {
				user = await this.adminService
					.findOneBy("en", {
						where: { id: payload.id, role: payload.role },
					})
					.then((res) => res.data);
			}

			if (!user) {
				throw new AuthorizationError();
			} else if (!user.is_active && user.role == Roles.STORE_ADMIN) {
				throw new StoreBlocked();
			}
		} catch (error) {
			throw error
		}

		return user;
	}
}
