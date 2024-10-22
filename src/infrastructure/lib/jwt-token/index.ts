import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Roles } from "src/common/database/Enums";
import { config } from "src/config";
import { AdminEntity, StoreEntity } from "src/core/entity";

@Injectable()
export class JwtToken {
	constructor(private readonly jwt: JwtService) {}

	public async generateToken(
		admin: AdminEntity | StoreEntity,
		role: Roles
	): Promise<{ access_token: string; refresh_token: string }> {
		const payload = {
			id: admin.id,
			role: role

		};

		const [access_token, refresh_token] = await Promise.all([
			this.jwt.sign(payload, {
				secret: config.ACCESS_SECRET_KEY,
				expiresIn: config.ACCESS_SECRET_TIME,
			}),

			this.jwt.sign(payload, {
				secret: config.REFRESH_SECRET_KEY,
				expiresIn: config.REFRESH_SECRET_TIME,
			}),
		]);

		// const token = await this.jwt.signAsync(payload, {
		//   secret: config.ACCESS_SECRET_KEY,
		//   expiresIn: config.ACCESS_SECRET_TIME,
		// });

		return { access_token, refresh_token };
	}

	public async generateAdminToken(admin: AdminEntity) {
		const payload = {
			id: admin.id,
			role: admin.role,
			phone_number: admin.phone_number
		}

		const token = await this.jwt.signAsync(payload, {
		  secret: config.ACCESS_SECRET_KEY,
		  expiresIn: '3d',
		});

		return token
	}

	public async verifyAccess(token: string) {
		return this.jwt.verifyAsync(token, { publicKey: config.ACCESS_SECRET_KEY });
	}

	public async verifyRefresh(token: string) {
		return this.jwt.verifyAsync(token, { publicKey: config.REFRESH_SECRET_KEY });
	}
}
