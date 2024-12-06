import { Injectable } from "@nestjs/common";
import { CreateStoreDto, UpdateStoreDto } from "./dto";
import { BaseService } from "src/infrastructure/lib/baseService";
import { AdminEntity, StoreEntity } from "src/core/entity";
import { InjectRepository } from "@nestjs/typeorm";
import { StoreRepository } from "src/core/repository";
import { responseByLang } from "src/infrastructure/lib/prompts/successResponsePrompt";
import { IResponse } from "src/common/type";
import { StoreAlreadyExists } from "./exception/store-already-exists";
import { BcryptEncryption } from "src/infrastructure/lib/bcrypt";
import { Roles, StorePaymentStatus } from "src/common/database/Enums";
import { StoreFilterDto } from "./dto/store-filter.dto";
import { FindOptionsWhereProperty, ILike } from "typeorm";

@Injectable()
export class StoreService extends BaseService<CreateStoreDto, UpdateStoreDto, StoreEntity> {
	constructor(@InjectRepository(StoreEntity) private readonly storeRepo: StoreRepository) {
		super(storeRepo, "Store");
	}

	/** create store api */
	public async createStore(
		dto: CreateStoreDto,
		lang: string,
		admin: AdminEntity,
	): Promise<IResponse<StoreEntity>> {
		const check_store: StoreEntity | null = await this.storeRepo.findOne({
			where: { username: dto.username },
		});

		if (check_store) {
			throw new StoreAlreadyExists();
		}

		let store_order: number | null = await this.storeRepo.maximum("order");

		if (store_order) {
			store_order += 1;
		} else {
			store_order = 1;
		}

		const store: StoreEntity = await this.storeRepo.save(
			this.storeRepo.create({
				...dto,
				order: store_order,
				created_by: admin,
				created_at: Date.now(),
			}),
		);

		const message = responseByLang("create", lang);

		return { status_code: 201, data: store, message };
	}

	/** blocking or unblockng or not store api */
	public async blockingOrUnblocking(
		id: string,
		is_active: boolean,
		lang: string,
	): Promise<IResponse<[]>> {
		const { data: store } = await this.findOneById(id, lang, { where: { is_deleted: false } });
		store.is_active = is_active;
		await this.storeRepo.save(store);
		const message = responseByLang("update", lang);
		return { status_code: 200, data: [], message };
	}

	public async updateStore(
		id: string,
		dto: UpdateStoreDto,
		lang: string,
		user: StoreEntity | AdminEntity,
	): Promise<IResponse<{}>> {
		const { data: store } = await this.findOneById(id, lang);

		if (dto.password) {
			dto.password = await BcryptEncryption.encrypt(dto.password);
		}

		if (user.role == Roles.STORE_ADMIN) {
			return await this.update(user.id, dto, lang);
		} else {
			return await this.update(id, dto, lang);
		}
	}

	/** find all store api for admin */
	public async findAllStore(
		query: StoreFilterDto,
		lang: string,
	): Promise<IResponse<StoreEntity[]>> {
		let where_condition: FindOptionsWhereProperty<StoreEntity> = { is_deleted: false };
		if (query.search) {
			where_condition = { name: ILike(`%${query.search}%`), is_deleted: false };
		}

		if (String(query.is_debtor) == "true") {
			where_condition.payments = [
				{ status: StorePaymentStatus.UNPAID },
				{ status: StorePaymentStatus.PARTLYPAID },
			];
		}

		return this.findAllWithPagination(lang, {
			where: where_condition,
			order: { order: "DESC" },
			take: query.page_size,
			skip: query.page,
		});
	}
}
