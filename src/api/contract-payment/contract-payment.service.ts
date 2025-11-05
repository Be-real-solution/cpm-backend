import { Injectable } from "@nestjs/common";
import { CreateContractPaymentDto } from "./dto/create-contract-payment.dto";
import { UpdateContractPaymentDto } from "./dto/update-contract-payment.dto";
import { BaseService } from "src/infrastructure/lib/baseService";
import { ContractPaymentEntity } from "src/core/entity/contract-payment.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { ContractPaymentRepository } from "src/core/repository";
import { AdminEntity, StoreEntity } from "src/core/entity";
import { ContractService } from "../contract/contract.service";
import { Cron } from "@nestjs/schedule";
import { SentIncorrectPaymentId } from "./exception/sent-incorrect-payment-id";
import { SentIncorrectAmount } from "./exception/incorrect-amount";
import { ContractPaymentStatus, Roles } from "src/common/database/Enums";
import { PaymentAlreadyPaid } from "./exception/payment-already-paid";
import { responseByLang } from "src/infrastructure/lib/prompts/successResponsePrompt";
import { IResponse } from "src/common/type";
import { CreatePaymentDto } from "./dto/create-payment.dto";

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
		const [{data: contract_payment}] = await Promise.all([
			this.findOneById(dto.contract_payment_id, lang, {
				where: { store },
				relations: { payments: true },
			}),
			this.contractService.findOneById(dto.contract_id, lang, {
				where: { store },
			}),
		]);

		const total = contract_payment.payments.reduce((acc, payment) => acc + payment.amount, 0);

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

	private async createPaymentSchedule() {
		const contract = await this.contractService.getRepository
			.createQueryBuilder("contract")
			.leftJoinAndSelect("contract.client", "client")
			.leftJoinAndSelect("contract.store", "store")
			.where(
				`
      	EXISTS (
        	SELECT 1 
        	FROM jsonb_array_elements(contract.payment_list->'payment_data') AS pd
        	WHERE (pd->>'date')::bigint <= :date
      	)
    	`,
				{ date: Date.now() },
			)
			.getOne();

		if (!contract) return;

		await this.contractPaymentRepo.save(
			this.contractPaymentRepo.create({
				amount: contract.payment_list.payment_data[0].price,
				amount_tiyn: contract.payment_list.payment_data[0].price * 100,
				method: contract.payment_list.payment_data[0].method,
				client: { id: contract.client.id },
				store: { id: contract.store.id },
				contract: { id: contract.id },
				status: ContractPaymentStatus.UNPAID,
				payment_date: new Date(contract.payment_list.payment_data[0].date),
			}),
		);
	}
}
