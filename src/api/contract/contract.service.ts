import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { exec } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { ContractPaymentMethod, ContractPaymentStatus, Roles } from "src/common/database/Enums";
import { IResponse } from "src/common/type";
import { config } from "src/config";
import {
	AdminEntity,
	ContractEntity,
	ContractPaymentEntity,
	ContractProductEntity,
	StoreEntity,
} from "src/core/entity";
import {
	ContractPaymentRepository,
	ContractProductRepository,
	ContractRepository,
} from "src/core/repository";
import { BaseService } from "src/infrastructure/lib/baseService";
import { deleteFile } from "src/infrastructure/lib/fileService";
import { responseByLang } from "src/infrastructure/lib/prompts/successResponsePrompt";
import {
	Between,
	FindOptionsWhereProperty,
	ILike,
	LessThanOrEqual,
	MoreThanOrEqual,
} from "typeorm";
import { v4 } from "uuid";
import { ClientService } from "../client/client.service";
import { ClientCardService } from "../client-card/client-card.service";
import { ContractFilterDto } from "./dto/contract-filter.dto";
import { CreateContractDto } from "./dto/create-contract.dto";
import { UpdateContractDto } from "./dto/update-contract.dto";
import { SentIncorrectAmount } from "./exception/incorrect-amount";
import { PaymentDataType } from "./types";
import { BindCardToContractDto } from "./dto/bind-card-contract.dto";
const pdf_creator = require("pdf-creator-node");

@Injectable()
export class ContractService extends BaseService<
	CreateContractDto,
	UpdateContractDto,
	ContractEntity
> {
	private readonly formatter = new Intl.NumberFormat("ru-RU", {
		style: "decimal", // yoki 'currency' valyuta uchun
		minimumFractionDigits: 0, // kasr son qismi kerak bo‘lmasa
	});

	constructor(
		@InjectRepository(ContractEntity) private readonly contractRepo: ContractRepository,
		@InjectRepository(ContractProductEntity)
		private readonly contractProductRepo: ContractProductRepository,
		private readonly clientService: ClientService,
		private readonly clientCardService: ClientCardService,
		@InjectRepository(ContractPaymentEntity)
		private readonly contractPaymentRepo: ContractPaymentRepository,
	) {
		super(contractRepo, "Contract");
	}

	/** create contract for store */
	public async createContract(dto: CreateContractDto, lang: string, store: StoreEntity) {
		const payment_list: PaymentDataType = (await this.calculateContractPayment(dto, lang)).data;

		const contract_number = await this.contractRepo.maximum("contract_number");
		let products: any[] = [];

		const { data: client } = await this.clientService.findOneById(dto.client, lang);

		const contract = await this.contractRepo.save(
			this.contractRepo.create({
				inn: dto.inn,
				initial_payment_percent: dto.initial_payment_percent,
				initial_payment_amount: dto.initial_payment_amount,
				start_date: dto.start_date,
				unpaid_month: dto.unpaid_month,
				duty_amount: dto.total_amount - dto.initial_payment_amount,
				total_amount: dto.total_amount,
				contract_number: contract_number ? contract_number + 1 : 1000,
				// payment_list: payment_list,
				client: client,
				store: store,
			}),
		);

		try {
			/** contract product yaratish */
			for (const item of dto.contract_product) {
				let product = await this.contractProductRepo.save(
					this.contractProductRepo.create({
						name: item.name,
						price: item.price,
						unit: item.unit,
						quantity: item.quantity,
						contract: contract,
					}),
				);
				products.push({
					name: item.name,
					price: this.formatter.format(item.price),
					unit: item.unit,
					quantity: item.quantity,
					total: this.formatter.format(item.quantity * item.price),
				});
			}

			const con = await this.findOneById(contract.id, lang, {
				relations: { store: true, client: true, contract_products: true },
			});

			const contract_pdf = await this.generatePdf(con.data, products);

			contract.contract_file_url = contract_pdf;
			await this.contractRepo.save(contract);
			await this.createPaymentList(contract, payment_list);
		} catch (err) {
			if (contract.contract_file_url) await deleteFile(contract.contract_file_url);
			await this.contractRepo.delete({ id: contract.id });
			throw err;
		}

		return { status_code: 201, data: contract, message: responseByLang("create", lang) };
	}

	async createPaymentList(contract: ContractEntity, payment_list: PaymentDataType) {
		for (const item of payment_list.payment_data) {
			await this.contractPaymentRepo.save(
				this.contractPaymentRepo.create({
					amount: item.price,
					amount_tiyn: item.price * 100,
					method: ContractPaymentMethod.NOT_SELECTED,
					client: { id: contract.client.id },
					store: { id: contract.store.id },
					contract: { id: contract.id },
					status: ContractPaymentStatus.UNPAID,
					payment_date: new Date(item.date),
				}),
			);
		}
	}

	/** bind card to contract */
	public async bindCardToContract(dto: BindCardToContractDto, lang: string, user: StoreEntity) {
		const { data: contract } = await this.findOneById(dto.contract_id, lang, {
			where: { store: user },
			relations: { client: true },
		});

		const { data: card } = await this.clientCardService.findOneById(dto.card_id, lang, {
			where: { client: { store: user, id: contract.client.id } },
		});

		contract.client_card = card;
		await this.contractRepo.save(contract);
		return { status_code: 200, data: contract, message: responseByLang("update", lang) };
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

		if (summa != dto.total_amount && dto.initial_payment_amount > dto.total_amount) {
			throw new SentIncorrectAmount();
		}

		const client = await this.clientService.findOneById(dto.client, "en");

		let startDate = new Date(dto.start_date);

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
				price: Number(
					((dto.total_amount - dto.initial_payment_amount) / dto.unpaid_month).toFixed(2),
				),
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
		let where_condition: FindOptionsWhereProperty<ContractEntity> = { is_deleted: false };
		if (query.client_id) {
			where_condition.client = { id: query.client_id };
		}

		if (query.store_id && user.role != Roles.STORE_ADMIN) {
			where_condition.store = { id: query.store_id };
		}

		if (query.from && query.to) {
			where_condition.created_at = Between(query.from, query.to);
		} else if (query.from) {
			where_condition.created_at = MoreThanOrEqual(query.from);
		} else if (query.to) {
			where_condition.created_at = LessThanOrEqual(query.to);
		}

		if (user.role == Roles.STORE_ADMIN) {
			where_condition.store = { id: user.id };
		}

		if (query.search) {
			where_condition = [
				{ ...where_condition, client: { phone: ILike(`%${query.search}%`) } },
				{ ...where_condition, contract_number: Number(query.search) },
			];
		}

		return this.findAllWithPagination(lang, {
			where: where_condition,
			order: { created_at: "DESC" },
			take: query.page_size,
			skip: query.page,
		});
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
			relations: { client: true, contract_products: true, contract_payments: true },
			order: { contract_payments: { payment_date: "DESC" } },
		});

		return { status_code: 200, data: contract, message: responseByLang("get_one", lang) };
	}

	/** generate contract pdf file */
	private async generatePdf(
		contract: ContractEntity,
		contract_products: ContractProductEntity[],
	) {
		const html = fs.readFileSync(
			path.join(__dirname, "../../../src/api/contract/template", "contract_pdf_template.hbs"),
			"utf-8",
		);

		const payment_list: any[] = [];
		let payment_month_price: number = 0;

		contract.payment_list.payment_data.forEach((item) => {
			let date = new Date(item.date);
			let year = date.getFullYear();
			let month = date.getMonth() + 1;
			let day = date.getDate();
			console.log(year, month, day, item.date);

			payment_list.push({
				id: item.id,
				month_year: month < 10 ? `0${month}/${year}` : `${month}/${year}`,
				day: day,
				price: item.price,
			});
			payment_month_price = item.price;
		});

		/** ru */
		const contract_total_amount_text = await this.numToWord(contract.total_amount, "ru");
		const payment_percent_amount_text = await this.numToWord(
			contract.initial_payment_amount,
			"ru",
		);
		const duty_payment_price_amount_text = await this.numToWord(contract.duty_amount, "ru");
		const payment_month_amount_text = await this.numToWord(
			Number(payment_month_price.toFixed(0)),
			"ru",
		);

		/** uz */
		const contract_total_amount_text_uz = await this.numToWord(contract.total_amount, "uz");
		const payment_percent_amount_text_uz = await this.numToWord(
			contract.initial_payment_amount,
			"uz",
		);
		const duty_payment_price_amount_text_uz = await this.numToWord(contract.duty_amount, "uz");
		const payment_month_amount_text_uz = await this.numToWord(
			Number(payment_month_price.toFixed(0)),
			"uz",
		);

		const date_uz = this.formatDateToday(new Date(Date.now()), "uz");
		const date_ru = this.formatDateToday(new Date(Date.now()), "ru");

		return await pdf_creator
			.create(
				{
					html: html,
					data: {
						city: contract.store.region,
						date_uz: date_uz,
						date_ru: date_ru,
						contract_number: contract.contract_number,
						store_director: contract.store.director,
						store_manager: contract.store.manager,
						store_bank_account_number: contract.store.bank_account_number,
						store_bank_address: contract.store.bank_address,
						store_mfo: contract.store.mfo,
						store_phone: contract.store.phone,
						store_address: contract.store.address,
						client_first_name: contract.client.first_name,
						client_last_name: contract.client.last_name,
						client_second_name: contract.client.second_name,
						client_address: contract.client.address,
						client_inn: contract.inn,
						client_phone: contract.client.phone,
						passport_given_by: contract.client.passport_given_by,

						payment_percent: 30,
						payment_percent_amount: this.formatter.format(
							contract.initial_payment_amount,
						),
						duty_payment_price_amount: this.formatter.format(contract.duty_amount),
						payment_month: contract.unpaid_month,
						payment_month_amount: this.formatter.format(payment_month_price),

						//ru
						contract_total_amount_text,
						payment_percent_amount_text,
						duty_payment_price_amount_text,
						payment_month_amount_text,

						//uz
						contract_total_amount_text_uz,
						payment_percent_amount_text_uz,
						duty_payment_price_amount_text_uz,
						payment_month_amount_text_uz,

						payment_list: payment_list,
						contract_total_amount: this.formatter.format(contract.total_amount),
						products: contract_products,
					},
					path: path.join(__dirname, "output.pdf"),
					type: "buffer",
				},
				{
					format: "A4",
					orientation: "portrait",
					border: "10mm",
				},
			)
			.then((res: any) => {
				console.log("PDF created successfully:", res);
				const file_name = `${contract.contract_number}_${v4()}.pdf`;
				const file_path = path.resolve(
					__dirname,
					"..",
					"..",
					"..",
					// "..",
					config.PATH_FOR_FILE_UPLOAD,
					"contract",
				);
				if (!fs.existsSync(file_path)) {
					fs.mkdirSync(file_path, { recursive: true });
				}
				fs.writeFileSync(path.join(file_path, file_name), res);
				return "contract/" + file_name;
			})
			.catch((error: any) => {
				console.error("Error creating PDF:", error);
				throw error;
			});
	}

	/** number to word */
	private numToWord(num: number, language: string): Promise<string> {
		return new Promise((resolve, reject) => {
			const command = `python3 src/api/contract/python-script/num_to_word.py ${num} ${language}`;

			exec(command, { encoding: "utf-8" }, (error, stdout, stderr) => {
				if (error) {
					console.error(`Execution error: ${error.message}`);
					reject(`Error: ${error.message}`);
					return;
				}
				if (stderr) {
					console.error(`Python stderr: ${stderr}`);
					reject(`Stderr: ${stderr}`);
					return;
				}
				resolve(stdout.trim());
			});
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
