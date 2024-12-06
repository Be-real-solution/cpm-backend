import { Injectable } from "@nestjs/common";
import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";
import { BaseService } from "src/infrastructure/lib/baseService";
import { AdminEntity, ClientEntity, StoreEntity } from "src/core/entity";
import { InjectRepository } from "@nestjs/typeorm";
import { ClientRepository } from "src/core/repository";
import { IResponse } from "src/infrastructure/lib/baseService/interface";
import { responseByLang } from "src/infrastructure/lib/prompts/successResponsePrompt";
import { StoreClientService } from "../store-client/store-client.service";
import { FilterDto } from "src/common/dto/filter.dto";
import { Roles } from "src/common/database/Enums";
import { FindOptionsWhereProperty } from "typeorm";

@Injectable()
export class ClientService extends BaseService<CreateClientDto, UpdateClientDto, ClientEntity> {
	constructor(
		@InjectRepository(ClientEntity) private readonly clientRepo: ClientRepository,
		private readonly storeClientService: StoreClientService,
	) {
		super(clientRepo, "CLient");
	}

	/** create client api for store */
	public async createClient(
		dto: CreateClientDto,
		lang: string,
		store: StoreEntity,
	): Promise<IResponse<ClientEntity>> {
		const client: ClientEntity = await this.clientRepo.save(
			this.clientRepo.create({ ...dto, created_at: Date.now(), created_by: store }),
		);

		await this.storeClientService.create(
			{ client: client.id, store: store?.id, status: true },
			lang,
		);

		const message = responseByLang("create", lang);
		return { status_code: 201, data: client, message };
	}

	/** find all api for store and admin */
	public async findAllClient(query: FilterDto, lang: string, user: StoreEntity | AdminEntity) {
		let where_condition: FindOptionsWhereProperty<ClientEntity> = { is_deleted: false };

		if (query.search) {
			where_condition = { passport: query.search, is_deleted: false };
		}

		// if (user.role == Roles.STORE_ADMIN) {
		return this.findAllWithPagination(lang, {
			where: where_condition,
			order: { created_at: "DESC" },
			take: query.page_size,
			skip: query.page,
		});
		// }
	}
}
