import { Injectable } from "@nestjs/common";
import { CreateContractDto } from "./dto/create-contract.dto";
import { UpdateContractDto } from "./dto/update-contract.dto";
import { BaseService } from "src/infrastructure/lib/baseService";
import { AdminEntity, ContractEntity, ContractProductEntity, StoreEntity } from "src/core/entity";
import { InjectRepository } from "@nestjs/typeorm";
import { ContractProductRepository, ContractRepository } from "src/core/repository";
import { SentIncorrectAmount } from "./exception/incorrect-amount";
import { ClientService } from "../client/client.service";
import { IResponse } from "src/common/type";
import { responseByLang } from "src/infrastructure/lib/prompts/successResponsePrompt";
import { Between, DataSource, FindOptionsWhereProperty, LessThanOrEqual, MoreThanOrEqual } from "typeorm";
import { PaymentDataType } from "./types";
import {
	ContractPaymentMethod,
	ContractPaymentStatus,
	ContractProductUnit,
	Roles,
} from "src/common/database/Enums";
import { FilterDto } from "src/common/dto/filter.dto";
import { ContractFilterDto } from "./dto/contract-filter.dto";

@Injectable()
export class ContractService extends BaseService<
	CreateContractDto,
	UpdateContractDto,
	ContractEntity
> {
	constructor(
		@InjectRepository(ContractEntity) private readonly contractRepo: ContractRepository,
		@InjectRepository(ContractProductEntity)
		private readonly contractProductRepo: ContractProductRepository,
		private readonly clientService: ClientService,
		private readonly datasource: DataSource,
	) {
		super(contractRepo, "Contract");
	}

	/** create contract for store */
	public async createContract(dto: CreateContractDto, lang: string, store: StoreEntity) {
		const payment_list: PaymentDataType = (await this.calculateContractPayment(dto, lang)).data;
		const transaction = this.datasource.createQueryRunner();
		await transaction.connect();
		await transaction.startTransaction();

		try {
			const client = await transaction.manager.findOne("clients", {
				where: { id: dto.client },
			});

			/** contract yaratish */
			const contract = await transaction.manager.save(
				"contracts",
				transaction.manager.create("contracts", {
					inn: dto.inn,
					initial_payment_type: dto.initial_payment_type,
					initial_payment_amount: dto.initial_payment_amount,
					start_date: dto.start_date,
					unpaid_month: dto.unpaid_month,
					duty_amount: dto.total_amount,
					total_amount: dto.total_amount,
					payment_list: payment_list,
					client: client,
					store: store,
				}),
			);

			/** contract product yaratish */
			dto.contract_product.forEach(async (item) => {
				await transaction.manager.save(
					"contract_products",
					transaction.manager.create("contract_products", {
						name: item.name,
						price: item.price,
						unit: item.unit,
						quantity: item.quantity,
						contract: contract,
					}),
				);
			});

			/** contract payment table yaratish */
			// payment_list.payment_data.forEach(async (item) => {
			// await transaction.manager.save(
			// 	"contract_payment_tables",
			// 	transaction.manager.create("contract_payment_tables", {
			// 		// date: item.date,
			// 		// amount: item.price,
			// 		payment_list: payment_list,
			// 		contract: contract,
			// 	}),
			// );
			// });

			await transaction.commitTransaction();
		} catch (err) {
			await transaction.rollbackTransaction();
			throw err;
		} finally {
			await transaction.release();
		}

		const message = responseByLang("create", lang);

		return { status_code: 201, data: [], message };
	}

	/** calculate contract payment table */
	public async calculateContractPayment(
		dto: CreateContractDto,
		lang: string,
	): Promise<IResponse<PaymentDataType>> {
		let summa = 0;

		dto.contract_product.forEach((item) => {
			summa += item.price * item.quantity;
		});

		if (summa != dto.total_amount) {
			throw new SentIncorrectAmount();
		}

		const client = await this.clientService.findOneById(dto.client, "en");

		let startDate = new Date(Date.now());

		let result: PaymentDataType = {
			payment_data: [],
			first_name: client.data.first_name,
			last_name: client.data.last_name,
			total: dto.total_amount,
		};

		// Har oy uchun sanalarni qo'shamiz (unpaid_month oy davomida)
		for (let i = 0; i < dto.unpaid_month; i++) {
			result.payment_data.push({
				id: i + 1,
				date: startDate.getTime(),
				price: dto.total_amount / dto.unpaid_month,
				method: ContractPaymentMethod.NOT_SELECTED,
				status: ContractPaymentStatus.UNPAID,
			});

			const currentMonth = startDate.getMonth();

			// Agar oy 11 bo'lsa (dekabr), unda keyingi yilning yanvar oyiga o'tkazish
			if (currentMonth === 11) {
				startDate.setFullYear(startDate.getFullYear() + 1); // Yilni oshiramiz
				startDate.setMonth(0); // Yanvar (0-oy) ga o'tkazamiz
			} else {
				startDate.setMonth(currentMonth + 1); // Keyingi oyning sanasini olish
			}
		}

		return { status_code: 200, data: result, message: responseByLang("get_one", lang) };
	}

	/** find all api for store and admin */
	public async findAllContract(
		query: ContractFilterDto,
		lang: string,
		user: StoreEntity | AdminEntity,
	): Promise<IResponse<ContractEntity[]>> {
		let where_condition: FindOptionsWhereProperty<ContractEntity> = {};
		if (query.client_id) {
			where_condition.client = { id: query.client_id };
		}

		if (query.from && query.to) {
			where_condition.created_at = Between(query.from, query.to)
		} else if (query.from) {
			where_condition.created_at = MoreThanOrEqual(query.from)
		} else if (query.to) {
			where_condition.created_at = LessThanOrEqual(query.to)
		}


		if (user.role == Roles.STORE_ADMIN) {
			where_condition.store = { id: user.id };
			where_condition.is_deleted = false;

			return this.findAllWithPagination(lang, {
				where: where_condition,
				order: { created_at: "DESC" },
				take: query.page_size,
				skip: query.page,
			});
		} else {
			where_condition.is_deleted = false;
			return this.findAllWithPagination(lang, {
				where: where_condition,
				order: { created_at: "DESC" },
				take: query.page_size,
				skip: query.page,
			});
		}
	}

	/** find one contract */
	public async findOneContract(
		id: string,
		lang: string,
		user: StoreEntity | AdminEntity,
	): Promise<IResponse<ContractEntity>> {
		let where: {} = {};
		if (user.role == Roles.STORE_ADMIN) {
			where = { store: user, is_deleted: false };
		} else {
			where = { is_deleted: false };
		}

		const { data: contract } = await this.findOneById(id, lang, {
			where,
			relations: { client: true, contract_products: true },
		});

		return { status_code: 200, data: contract, message: responseByLang("get_one", lang) };
	}


}
