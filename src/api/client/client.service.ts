import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ContractStatus, Roles } from "src/common/database/Enums";
import { FilterDto } from "src/common/dto/filter.dto";
import { AdminEntity, ClientEntity, StoreEntity } from "src/core/entity";
import { ClientRepository } from "src/core/repository";
import { BaseService } from "src/infrastructure/lib/baseService";
import { IResponse } from "src/infrastructure/lib/baseService/interface";
import { responseByLang } from "src/infrastructure/lib/prompts/successResponsePrompt";
import { FindOptionsWhereProperty, ILike, Not } from "typeorm";
import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";
import { PassportOrPinflAlreadyExists } from "./exception/passport-or-pinfl-already-exists";
import { FindByClientDetailDto } from "./dto/find-by-client-details.dto";
import { ClientCardEntity } from "src/core/entity";
import { ClientCardRepository } from "src/core/repository";
import { BindClientCardDto } from "./dto/bind-client-card.dto";

@Injectable()
export class ClientService extends BaseService<CreateClientDto, UpdateClientDto, ClientEntity> {
	constructor(
		@InjectRepository(ClientEntity) private readonly clientRepo: ClientRepository,
		@InjectRepository(ClientCardEntity) private readonly clientCardRepo: ClientCardRepository,
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
		let where_condition: FindOptionsWhereProperty<ClientEntity> = {
			store: user,
			is_deleted: false,
		};

		if (query.search) {
			where_condition = [
				{ store: user, passport: ILike(`%${query.search}%`), is_deleted: false },
				{ store: user, first_name: ILike(`%${query.search}%`), is_deleted: false },
				{ store: user, last_name: ILike(`%${query.search}%`), is_deleted: false },
				{ store: user, second_name: ILike(`%${query.search}%`), is_deleted: false },
			];
		}

		return this.findAllWithPagination(lang, {
			where: where_condition,
			order: { created_at: "DESC" },
			take: query.page_size,
			skip: query.page,
		});
	}

	/** find one by client detail */
	public async findClientDetail(
		dto: FindByClientDetailDto,
		lang: string,
	): Promise<IResponse<ClientEntity[]>> {
		let where_condition: FindOptionsWhereProperty<ClientEntity> = {
			first_name: dto.first_name,
			last_name: dto.last_name,
			passport: dto.passport,
			pinfl: dto.pinfl,
			contracts: { status: ContractStatus.UNPAID, is_deleted: false },
			is_deleted: false,
		};

		if (dto.second_name) {
			where_condition.second_name = dto.second_name;
		}

		return this.findAll(lang, {
			where: where_condition,
			relations: { contracts: true, store: true },
		});
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
				where: where_condition,
			});

			if (check_client) {
				throw new PassportOrPinflAlreadyExists();
			}
		}

		await this.clientRepo.update(id, dto);

		return { status_code: 200, data: [], message: responseByLang("update", lang) };
	}

	/** bind client card */
	public async bindClientCard(dto: BindClientCardDto) {
		const client = await this.findOneById(dto.client_id, "uz", {
			where: { is_active: true, store: { id: dto.store_id } },
		});
	console.log("dto confirm card",dto);
	
		const client_card = await this.clientCardRepo.save({
			client: client.data,
			card_id: dto.data.card_id,
			card_token: dto.data.card_token,
			card_holder: dto.data.card_holder,
			card_number: dto.data.pan,
			expiry: dto.data.expiry,
			balance: dto.data.balance,
			phone: dto.data.phone,
		});

		return { status_code: 200, data: client_card, message: responseByLang("create", "uz") };
	}
}
