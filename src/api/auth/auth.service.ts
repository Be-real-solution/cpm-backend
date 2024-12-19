import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Roles } from "src/common/database/Enums";
import { IResponse } from "src/common/type";
import { AdminEntity, StoreEntity } from "src/core/entity";
import { AdminRepository, StoreRepository } from "src/core/repository";
import { BcryptEncryption } from "src/infrastructure/lib/bcrypt";
import { JwtToken } from "src/infrastructure/lib/jwt-token";
import { LoginDto } from "./dto/login.dto";
import {
	AuthorizationError
} from "./exception";

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(AdminEntity) private readonly adminRepo: AdminRepository,
		@InjectRepository(StoreEntity) private readonly storeRepo: StoreRepository,
		private readonly jwtToken: JwtToken,
	) {
	}

	/** admin login */
	public async adminLogin(dto: LoginDto): Promise<IResponse<any>> {
		const admin: AdminEntity | null = await this.adminRepo.findOne({
			where: { username: dto.username },
		});

		if (!admin) {
			throw new AuthorizationError();
		}

		const check_pass: Boolean = await BcryptEncryption.compare(dto.password, admin.password);

		if (!check_pass) {
			throw new AuthorizationError();
		}

		const token = await this.jwtToken.generateToken(admin, admin.role);
		return { status_code: 200, data: { ...admin, token }, message: "success" };
	}

	/** store login */
	public async storeLogin(dto: LoginDto): Promise<IResponse<any>> {
		const store: StoreEntity | null = await this.storeRepo.findOne({
			where: { username: dto.username, is_active: true, is_deleted: false },
		});

		if (!store) {
			throw new AuthorizationError();
		}

		const check_pass: Boolean = await BcryptEncryption.compare(dto.password, store.password);

		if (!check_pass) {
			throw new AuthorizationError();
		}

		const token = await this.jwtToken.generateToken(store, Roles.STORE_ADMIN);
		return { status_code: 200, data: { ...store, token }, message: "success" };
	}


	// refresh token service
	public async refreshToken(token: string) {
		// let data;
		// try {
		// 	data = await this.jwtToken.verifyRefresh(token);
		// } catch (err) {
		// 	throw new AuthorizationError();
		// }

		// const { data: user } = await this.findOneById(data.id, "en");

		// const check = await BcryptEncryption.compare(token, user.hashed_token);

		// if (!check) {
		// 	throw new InvalidToken();
		// }

		// const new_token = await this.jwtToken.generateToken(user);
		// const hashed_token = await BcryptEncryption.encrypt(new_token.refresh_token);
		// await this.userRepo.update(user.id, { hashed_token });

		// return new_token;
	}



}

function AddMinutesToDate(date: Date, minutes: number) {
	return new Date(date.getTime() + minutes * 60000).getTime();
}
