import { Injectable } from "@nestjs/common";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { UpdateAdminDto } from "./dto/update-admin.dto";
import { BaseService } from "src/infrastructure/lib/baseService";
import { AdminEntity } from "src/core/entity";
import { InjectRepository } from "@nestjs/typeorm";
import { AdminRepository } from "src/core/repository";
import { AdminAlreadyExists } from "./exception/admin-already-exists";
import { BcryptEncryption } from "src/infrastructure/lib/bcrypt";
import { responseByLang } from "src/infrastructure/lib/prompts/successResponsePrompt";
import { IResponse } from "src/common/type";
import { JwtToken } from "src/infrastructure/lib/jwt-token";
import { Roles } from "src/common/database/Enums";
import { Not } from "typeorm";

@Injectable()
export class AdminService extends BaseService<CreateAdminDto, UpdateAdminDto, AdminEntity> {
	constructor(
		@InjectRepository(AdminEntity) private readonly adminRepo: AdminRepository,
		private readonly jwtToken: JwtToken,
	) {
		super(adminRepo, "Admin");
	}

	public async createSuperAdmin(
		dto: CreateAdminDto,
		lang: string,
	): Promise<IResponse<AdminEntity>> {
		const admin = await this.adminRepo.findOne({
			where: { username: dto.username, is_deleted: false },
		});

		if (admin) {
			throw new AdminAlreadyExists();
		}

		const pass = await BcryptEncryption.encrypt(dto.password);

		const new_admin = await this.adminRepo.save(
			this.adminRepo.create({ ...dto, password: pass }),
		);

		const message = responseByLang("create", lang);
		return { status_code: 201, data: new_admin, message };
	}

	/** create admin */
	public async createAdmin(dto: CreateAdminDto, lang: string): Promise<IResponse<AdminEntity>> {
		const admin = await this.adminRepo.findOne({
			where: { username: dto.username, is_deleted: false },
		});

		if (admin) {
			throw new AdminAlreadyExists();
		}

		const pass = await BcryptEncryption.encrypt(dto.password);

		const new_admin = await this.adminRepo.save(
			this.adminRepo.create({ ...dto, password: pass }),
		);

		const message = responseByLang("create", lang);
		return { status_code: 201, data: new_admin, message };
	}

	/** update admin */
	public async updateAdmin(id: string, dto: UpdateAdminDto, lang: string, admin: AdminEntity) {
		if (dto.username) {
			const admin = await this.adminRepo.findOne({
				where: { username: dto.username, id: Not(id) },
			});
			if (admin) {
				throw new AdminAlreadyExists();
			}
		}

		if (dto.password) {
			const pass = await BcryptEncryption.encrypt(dto.password);
			dto.password = pass;
		}

		if (admin.role === Roles.SUPER_ADMIN) {
			await this.findOneById(id, lang);
			await this.adminRepo.update(id, dto);
		} else {
			const { data: admin_data } = await this.findOneBy(lang, {
				where: { id: admin.id, is_deleted: false },
			});

			await this.adminRepo.update(admin.id, { ...dto, role: admin.role });
		}

		const message = responseByLang("update", lang);
		return { status_code: 200, data: [], message };
	}
}
