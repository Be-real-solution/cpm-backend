import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Roles } from "src/common/database/Enums";
import { IResponse } from "src/common/type";
import { AdminEntity, StoreEntity } from "src/core/entity";
import { AdminRepository, StoreRepository } from "src/core/repository";
import { BcryptEncryption } from "src/infrastructure/lib/bcrypt";
import { JwtToken } from "src/infrastructure/lib/jwt-token";
import { LoginDto } from "./dto/login.dto";
import { AuthorizationError } from "./exception";
import { RefreshTokenDto } from "./dto/refresh-token.dto";

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(AdminEntity) private readonly adminRepo: AdminRepository,
		@InjectRepository(StoreEntity) private readonly storeRepo: StoreRepository,
		private readonly jwtToken: JwtToken,
	) {}

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
		admin.hashed_token = await BcryptEncryption.encrypt(token.refresh_token);
		await this.adminRepo.save(admin);
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
		store.hashed_token = await BcryptEncryption.encrypt(token.refresh_token);
		await this.storeRepo.save(store);
		return { status_code: 200, data: { ...store, token }, message: "success" };
	}

	// refresh token service
	public async refreshToken(dto: RefreshTokenDto) {
		const token = dto.token
		let data: { id: string; role: string };
		try {
			data = await this.jwtToken.verifyRefresh(token);
		} catch (err) {
			throw new AuthorizationError();
		}
		
		if (data.role == Roles.STORE_ADMIN) {
			const store = await this.storeRepo.findOne({ where: { id: data.id } });
			if (!store) throw new AuthorizationError();
			
			const check = await BcryptEncryption.compare(token, store.hashed_token);
			console.log(check);
			if (!check) throw new AuthorizationError();

			const new_token = await this.jwtToken.generateToken(store, Roles.STORE_ADMIN);
			store.hashed_token = await BcryptEncryption.encrypt(new_token.refresh_token);
			await this.storeRepo.save(store);
			return { status_code: 200, data: { ...store, token: new_token }, message: "success" };
		} else {
			const admin = await this.adminRepo.findOne({ where: { id: data.id } });
			if (!admin) throw new AuthorizationError();

			const check = await BcryptEncryption.compare(token, admin.hashed_token);
			if (!check) throw new AuthorizationError();

			const new_token = await this.jwtToken.generateToken(admin, admin.role);
			admin.hashed_token = await BcryptEncryption.encrypt(new_token.refresh_token);
			await this.adminRepo.save(admin);
			return { status_code: 200, data: { ...admin, token: new_token }, message: "success" };			
		}
	}
}

function AddMinutesToDate(date: Date, minutes: number) {
	return new Date(date.getTime() + minutes * 60000).getTime();
}
