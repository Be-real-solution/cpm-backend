import { Injectable } from "@nestjs/common";
import { CreateContractPaymentDto } from "./dto/create-contract-payment.dto";
import { UpdateContractPaymentDto } from "./dto/update-contract-payment.dto";
import { BaseService } from "src/infrastructure/lib/baseService";
import { ContractPaymentEntity } from "src/core/entity/contract-payment.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { ContractPaymentRepository } from "src/core/repository";
import { AdminEntity, PaymentEntity, StoreEntity } from "src/core/entity";
import { ContractService } from "../contract/contract.service";
import { Cron } from "@nestjs/schedule";
import { SentIncorrectPaymentId } from "./exception/sent-incorrect-payment-id";
import { SentIncorrectAmount } from "./exception/incorrect-amount";
import { ContractPaymentMethod, ContractPaymentStatus, Roles } from "src/common/database/Enums";
import { PaymentAlreadyPaid } from "./exception/payment-already-paid";
import { responseByLang } from "src/infrastructure/lib/prompts/successResponsePrompt";
import { IResponse } from "src/common/type";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { LessThanOrEqual, Repository } from "typeorm";
import { PaymentService } from "../payment/payment.service";

@Injectable()
export class ContractPaymentService extends BaseService<
	ContractPaymentService,
	UpdateContractPaymentDto,
	ContractPaymentEntity
> {
	constructor(
		@InjectRepository(ContractPaymentEntity)
		private readonly contractPaymentRepo: ContractPaymentRepository,
		private readonly contractService: ContractService,
		private readonly paymentService: PaymentService,

		@InjectRepository(PaymentEntity)
		private readonly paymentRepo: Repository<PaymentEntity>,
	) {
		super(contractPaymentRepo, "Contract payment");
	}

	// @Cron("* * * * * *")
	/** create contract payment api */
	public async createContractPayment(
		dto: CreateContractPaymentDto,
		lang: string,
		store: StoreEntity,
	): Promise<IResponse<ContractPaymentEntity>> {
		const { data: contract } = await this.contractService.findOneById(
			dto.contract_id, //"1ea36ee2-c754-451a-ae15-acb42c82050a",
			lang,
			{
				where: { store }, //"69350607-55a8-446c-b370-2aa11a958c5b" } },
				relations: { client: true },
			},
		);

		console.log(contract.payment_list);

		const payment_table_id = contract.payment_list.payment_data.findIndex(
			(item) => item.id == dto.contract_payment_table_id,
		);

		const check_status = contract.payment_list.payment_data.find(
			(item) => item.status == ContractPaymentStatus.UNPAID,
		);

		if (payment_table_id == -1 || !check_status || payment_table_id != check_status?.id - 1) {
			throw new SentIncorrectPaymentId();
		}

		if (contract.payment_list.payment_data[payment_table_id].price !== dto.amount) {
			throw new SentIncorrectAmount();
		}

		if (
			contract.payment_list.payment_data[payment_table_id].status ==
			ContractPaymentStatus.PAID
		) {
			throw new PaymentAlreadyPaid();
		}

		contract.payment_list.payment_data[payment_table_id].method = dto.method;
		contract.payment_list.payment_data[payment_table_id].status = ContractPaymentStatus.PAID;
		contract.payment_list.total -= dto.amount;

		console.log(contract.payment_list.payment_data);

		await this.contractService.getRepository.save(contract);
		const contract_payment = await this.contractPaymentRepo.save(
			this.contractPaymentRepo.create({
				amount: dto.amount,
				method: dto.method,
				client: { id: contract.client.id },
				store: { id: store.id },
				contract: { id: contract.id },
			}),
		);

		return {
			status_code: 201,
			data: contract_payment,
			message: responseByLang("create", lang),
		};
	}

	public async createPayment(
		dto: CreatePaymentDto,
		lang: string,
		store: StoreEntity,
	): Promise<IResponse<ContractPaymentEntity>> {
		const [{ data: contract_payment }] = await Promise.all([
			this.findOneById(dto.contract_payment_id, lang, {
				where: { store },
				relations: { payments: true },
			}),
			this.contractService.findOneById(dto.contract_id, lang, {
				where: { store },
			}),
		]);

		if (dto.amount != contract_payment.amount) {
			throw new SentIncorrectAmount();
		}

		contract_payment.status = ContractPaymentStatus.PAID;
		await this.contractPaymentRepo.save(contract_payment);

		return {
			status_code: 201,
			data: contract_payment,
			message: responseByLang("update", lang),
		};
	}

	/** find all contract payment api */
	public async findAllContractPayment(
		lang: string,
		user: StoreEntity | AdminEntity,
	): Promise<IResponse<ContractPaymentEntity[]>> {
		let contract_payment: ContractPaymentEntity[];
		if (user.role == Roles.STORE_ADMIN) {
			contract_payment = await this.contractPaymentRepo.find({
				where: { store: user },
				order: { created_at: "DESC" },
			});
		} else {
			contract_payment = await this.contractPaymentRepo.find({
				order: { created_at: "DESC" },
			});
		}

		return {
			status_code: 200,
			data: contract_payment,
			message: responseByLang("get_all", lang),
		};
	}

	/** create payment schedule */
	// @Cron("*/5 * * * *")
	private async createPaymentSchedule() {
		const todayStart = new Date();
		todayStart.setHours(0, 0, 0, 0);

		const contractPayment = await this.contractPaymentRepo.find({
			where: {
				status: ContractPaymentStatus.UNPAID,
				payment_date: LessThanOrEqual(todayStart),
			},
			relations: { contract: { client_card: true }, client: true },
		});

		console.log("contractPayment", contractPayment);

		for (const item of contractPayment) {
			const response = await this.paymentService.createPay(
				{
					amount: item.amount,
					store_id: item.store?.atmos_id,
				},
				item.store,
			);
			console.log("response", response);

			if (response.result.code !== "OK") {
				continue;
			}

			const result = await this.paymentService.confirmPay({
				transaction_id: response.data.transaction_id,
				store_id: item.store?.atmos_id,
				card_token: item.contract?.client_card?.card_token,
			});
			console.log("result", result);

			if (result.result.code !== "OK") {
				continue;
			}

			item.method = ContractPaymentMethod.ATMOS;
			item.status = ContractPaymentStatus.PAID;
			item.transaction_id = response.data?.transaction_id;

			const payment = await this.paymentRepo.save(
				this.paymentRepo.create({
					amount: result.amount,
					store_id: item.store?.atmos_id,
					contract_payment_id: item.id,
				}),
			);

			await this.contractPaymentRepo.save(item);
		}
	}

	public async manualPaymentSchedule() {
		await this.createPaymentSchedule();
		return { message: "Payment schedule executed manually" };
	}
}
