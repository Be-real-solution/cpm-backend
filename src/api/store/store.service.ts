import { Injectable } from "@nestjs/common";
import { CreateStoreDto, UpdateStoreDto } from "./dto";
import { BaseService } from "src/infrastructure/lib/baseService";
import { AdminEntity, StoreEntity } from "src/core/entity";
import { InjectRepository } from "@nestjs/typeorm";
import { StoreRepository } from "src/core/repository";
import { responseByLang } from "src/infrastructure/lib/prompts/successResponsePrompt";
import { IResponse } from "src/common/type";

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
}
