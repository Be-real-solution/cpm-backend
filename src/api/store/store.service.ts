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
import { FindOptionsWhereProperty, ILike, Not } from "typeorm";
import { Cron } from "@nestjs/schedule";
import * as fs from "fs";
import * as path from "path";
import { config } from "src/config";
import { v4 } from "uuid";
import { CreateStoreContractPDFDto } from "./dto/create-store-contract-pdf.dto";
import { deleteFile } from "src/infrastructure/lib/fileService";
import { Pager } from "src/infrastructure/lib/pagination";
const pdf_creator = require("pdf-creator-node");

@Injectable()
export class StoreService extends BaseService<CreateStoreDto, UpdateStoreDto, StoreEntity> {
	private readonly formatter = new Intl.NumberFormat("ru-RU", {
		style: "decimal", // yoki 'currency' valyuta uchun
		minimumFractionDigits: 0, // kasr son qismi kerak bo‘lmasa
	});

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

		dto.password = await BcryptEncryption.encrypt(dto.password);

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

		if (dto.username) {
			const res = await this.storeRepo.findOne({
				where: { username: dto.username, id: Not(id) },
			});

			if (res) {
				throw new StoreAlreadyExists();
			}
		}

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

	/** report store api for admin */
	public async reportStore(
		query: StoreFilterDto,
		lang: string,
	): Promise<IResponse<StoreEntity[]>> {
		let store = await this.storeRepo
			.createQueryBuilder(`store`)
			.leftJoinAndSelect("store.contracts", "contract")
			.select([
				"store.id as id",
				"store.is_active as is_active",
				"store.is_deleted as is_deleted",
				"store.created_at as created_at",
				"store.updated_at as updated_at",
				"store.deleted_at as deleted_at",
				"store.name as name",
				"store.phone as phone",
				"store.region as region",
				"store.address as address",
				"store.director as director",
				"store.manager as manager",
				"store.username as username",
				"store.password as password",
				"store.bank_account_number as bank_account_number",
				"store.bank_address as bank_address",
				"store.mfo as mfo",
				"store.stir as stir",
				"store.payment_day as payment_day",
				"store.monthly_payment as monthly_payment",
				"store.responsible_person as responsible_person",
				"store.second_phone as second_phone",
				"store.order as order",
				"store.store_contract_file_url as store_contract_file_url",
				"store.role as role",
				"store.hashed_token as hashed_token",
				"store.created_by ascreated_by",
				"count(contract.id) as contract_count",
				"sum(contract.total_amount) as contract_total_amount",
				"sum(contract.paid_amount) as contract_paid_amount",
			])
			.offset((query.page - 1) * query.page_size)
			.limit(query.page_size)
			.groupBy("store.id")
			.getRawMany();

		const count = await this.storeRepo.count();

		return Pager.of(
			store,
			count,
			query.page_size,
			query.page,
			200,
			responseByLang("get_all", lang),
		);
	}

	/** generate store contract pdf file */
	public async createStoreContractPdf(
		dto: CreateStoreContractPDFDto,
		lang: string,
	): Promise<IResponse<StoreEntity>> {
		const { data: store } = await this.findOneById(dto.store, lang);

		let html: string = "";
		let date: string = "";
		if (dto.language == "uz") {
			date = this.formatDateToday(new Date(Date.now()), "uz");
			html = fs.readFileSync(
				path.join(__dirname, "../../../src/api/store/template", "store-contract-uz.hbs"),
				"utf-8",
			);
		} else {
			html = fs.readFileSync(
				path.join(__dirname, "../../../src/api/store/template", "store-contract-ru.hbs"),
				"utf-8",
			);
			date = this.formatDateToday(new Date(Date.now()), "ru");
		}

		return await pdf_creator
			.create(
				{
					html: html,
					data: {
						city: store.region,
						date: date,
						store_contract_number: store.order + 999,
						store_name: store.name,
						store_address: store.address,
						store_bank_number: store.bank_account_number,
						store_bank_address: store.bank_address,
						store_mfo: store.mfo,
						store_phone: store.phone,
						store_director: store.director,
						store_manager: store.manager,
						store_stir: store.stir,
					},
					// path: path.join(__dirname, "output.pdf"),
					type: "buffer",
				},
				{
					format: "A4",
					orientation: "portrait",
					border: "10mm",
				},
			)
			.then(async (res: any) => {
				console.log("PDF created successfully:", res);
				const file_name = `${store.order + 999}_${v4()}_${
					dto.language == "uz" ? "uz" : "ru"
				}.pdf`;
				const file_path = path.resolve(
					__dirname,
					"..",
					"..",
					"..",
					// "..",
					config.PATH_FOR_FILE_UPLOAD,
					"store-contract",
				);
				if (!fs.existsSync(file_path)) {
					fs.mkdirSync(file_path, { recursive: true });
				}
				fs.writeFileSync(path.join(file_path, file_name), res);

				if (store.store_contract_file_url) {
					await deleteFile(store.store_contract_file_url);
				}

				store.store_contract_file_url = "store-contract/" + file_name;
				await this.storeRepo.save(store);

				return { status_code: 200, data: store, message: responseByLang("update", lang) };
			})
			.catch((error: any) => {
				console.error("Error creating PDF:", error);
				throw error;
			});
	}

	/** formatted date for today */
	private formatDateToday(date: Date, lang: string): string {
		const months_uz = [
			"yanvar",
			"fevral",
			"mart",
			"aprel",
			"may",
			"iyun",
			"iyul",
			"avgust",
			"sentyabr",
			"oktyabr",
			"noyabr",
			"dekabr",
		];
		const months_ru = [
			"января",
			"февраля",
			"марта",
			"апреля",
			"мая",
			"июня",
			"июля",
			"августа",
			"сентября",
			"октября",
			"ноября",
			"декабря",
		];
		let month_number = date.getMonth();
		const day = date.getDate();
		const month = lang == "uz" ? months_uz[month_number] : months_ru[month_number];
		const year = date.getFullYear();
		return `${day} ${month} ${year}`;
	}
}
