import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Roles } from "src/common/database/Enums";
import { FilterDto } from "src/common/dto/filter.dto";
import { AdminEntity, ClientEntity, StoreEntity } from "src/core/entity";
import { ClientRepository } from "src/core/repository";
import { BaseService } from "src/infrastructure/lib/baseService";
import { IResponse } from "src/infrastructure/lib/baseService/interface";
import { responseByLang } from "src/infrastructure/lib/prompts/successResponsePrompt";
import { FindOptionsWhereProperty, Not } from "typeorm";
import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";
import { PassportOrPinflAlreadyExists } from "./exception/passport-or-pinfl-already-exists";

@Injectable()
export class ClientService extends BaseService<CreateClientDto, UpdateClientDto, ClientEntity> {
	constructor(
		@InjectRepository(ClientEntity) private readonly clientRepo: ClientRepository,
	) {
		super(clientRepo, "CLient");
	}

	/** create client api for store */
	public async createClient(
		dto: CreateClientDto,
		lang: string,
		store: StoreEntity,
	): Promise<IResponse<ClientEntity>> {
		const check_client = await this.clientRepo.findOne({
			where: [
				{ store, passport: dto.passport, is_deleted: false },
				{ store, pinfl: dto.pinfl, is_deleted: false },
			],
		});

		if (check_client) {
			throw new PassportOrPinflAlreadyExists();
		}

		const client: ClientEntity = await this.clientRepo.save(
			this.clientRepo.create({ ...dto, created_at: Date.now(), store: store }),
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

		if (user.role == Roles.STORE_ADMIN) {
			where_condition.store = user;
			return this.findAllWithPagination(lang, {
				where: where_condition,
				order: { created_at: "DESC" },
				take: query.page_size,
				skip: query.page,
			});
		}
	}

	/** update client */
	public async updateClient(
		id: string,
		dto: UpdateClientDto,
		lang: string,
		store: StoreEntity,
	): Promise<IResponse<[]>> {
		await this.findOneById(id, lang, { where: { store, is_deleted: false } });

		if (dto.passport || dto.pinfl) {
			const where_condition: FindOptionsWhereProperty<ClientEntity> = [];

			if (dto.passport) {
				where_condition.push({
					store,
					passport: dto.passport,
					is_deleted: false,
					id: Not(id),
				});
			}

			if (dto.pinfl) {
				where_condition.push({
					store,
					pinfl: dto.pinfl,
					is_deleted: false,
					id: Not(id),
				});
			}
			const check_client = await this.clientRepo.findOne({
				where: where_condition
			});

			if (check_client) {
			throw new PassportOrPinflAlreadyExists();
			}
		}

		await this.clientRepo.update(id, dto);

		return { status_code: 200, data: [], message: responseByLang("update", lang) };
	}
}
