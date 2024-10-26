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

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
	constructor(private adminService: AdminService, private storeService: StoreService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: config.ACCESS_SECRET_KEY,
			// secretOrKey: config.REFRESH_SECRET_KEY,
			passReqToCallback: true,
		});
	}

	async validate(req: Request, payload: AuthPayload) {
		let user: AdminEntity | StoreEntity | null = null;

    console.log(1, payload);
    

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

			if (!user || !user?.is_active) {
				console.log(4);
				
				throw new AuthorizationError();
			}
		} catch (error) {}

		return user;
	}
}
