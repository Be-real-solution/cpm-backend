import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { StorePaymentStatus } from "src/common/database/Enums";
import { IResponse } from "src/common/type";
import { AdminEntity, StoreEntity, StorePaymentEntity } from "src/core/entity";
import { StorePaymentRepository } from "src/core/repository";
import { BaseService } from "src/infrastructure/lib/baseService";
import { responseByLang } from "src/infrastructure/lib/prompts/successResponsePrompt";
import { StoreService } from "../store/store.service";
import { CreateStorePaymentDto } from "./dto/create-store-payment.dto";
import { UpdateStorePaymentDto } from "./dto/update-store-payment.dto";
import { Cron } from "@nestjs/schedule";
import { IncorrectPaymentDate } from "./exception/incorrect-payment-date";
import { Not } from "typeorm";

@Injectable()
export class StorePaymentService extends BaseService<
	CreateStorePaymentDto,
	UpdateStorePaymentDto,
	StorePaymentEntity
> {
	constructor(
		@InjectRepository(StorePaymentEntity)
		private readonly storePaymentRepo: StorePaymentRepository,
		private readonly storeService: StoreService,
	) {
		super(storePaymentRepo, "Store payment");
	}

	/** create store payment api for admins */
	public async createStorePayment(
		dto: CreateStorePaymentDto,
		lang: string,
		admin: AdminEntity,
	): Promise<IResponse<StorePaymentEntity>> {
		const { data: store } = await this.storeService.findOneById(dto.store_id, lang, {
			where: { is_deleted: false },
			relations: { payments: true },
		});

		let dto_day = new Date(+dto.for_month).getDate();
		if (dto_day != store.payment_day) {
			throw new IncorrectPaymentDate();
		}

		const has_store_pay = await this.storePaymentRepo.findOne({
			where: { store, for_month: dto.for_month, status: Not(StorePaymentStatus.PAID) },
			relations: { created_by: true },
		});

		let store_payment: StorePaymentEntity = new StorePaymentEntity();

		if (has_store_pay) {
			if (dto.amount >= has_store_pay.monthly_payment - has_store_pay.amount) {
				dto.amount = dto.amount - (has_store_pay.monthly_payment - has_store_pay.amount);

				has_store_pay.amount = has_store_pay.monthly_payment;
				has_store_pay.status = StorePaymentStatus.PAID;
			} else {
				has_store_pay.amount = Number(has_store_pay.amount) + dto.amount;
				dto.amount = 0;
			}
			has_store_pay.updated_at = Date.now();
			await this.storePaymentRepo.save(has_store_pay);
			store_payment = has_store_pay;

			dto.amount = await this.paymentPassedMonths(dto.amount, store);
		} else {
			dto.amount = await this.paymentPassedMonths(dto.amount, store);
			let amount = 0;
			if (dto.amount >= store.monthly_payment) {
				amount = store.monthly_payment;
				dto.amount -= store.monthly_payment;
			} else {
				amount = dto.amount;
				dto.amount = 0;
			}

			store_payment = await this.storePaymentRepo.save(
				this.storePaymentRepo.create({
					amount: amount,
					for_month: dto.for_month,
					monthly_payment: store.monthly_payment,
					created_at: Date.now(),
					created_by: admin,
					store: store,
					status:
						amount == store.monthly_payment
							? StorePaymentStatus.PAID
							: StorePaymentStatus.PARTLYPAID,
				}),
			);
		}

		if (dto.amount)
			await this.paymentAnotherMonths(+store_payment.for_month, store, dto.amount, admin);

		return { status_code: 201, data: store_payment, message: responseByLang("create", lang) };
	}

	// dto.amount da ortiqcha summa mavjud bo'lsa
	private async paymentAnotherMonths(
		for_month: number,
		store: StoreEntity,
		all_amount: number,
		admin: AdminEntity,
	): Promise<void> {
		while (all_amount) {
			let month = new Date(for_month).getMonth() + 1;
			let year = new Date(for_month).getFullYear();

			if (month == 12) {
				year++;
				month = 0;
			}

			for_month = new Date(`${year}-${month + 1}-${store.payment_day}`).getTime();

			const payment: StorePaymentEntity | null = await this.storePaymentRepo.findOne({
				where: {
					for_month,
				},
			});

			if (!payment) {
				let amount = 0;
				if (all_amount >= store.monthly_payment) {
					amount = store.monthly_payment;
					all_amount -= store.monthly_payment;
				} else {
					amount = all_amount;
					all_amount = 0;
				}

				await this.storePaymentRepo.save(
					this.storePaymentRepo.create({
						amount: amount,
						monthly_payment: store.monthly_payment,
						for_month,
						store,
						created_by: admin,
						created_at: Date.now(),
						status:
							amount == store.monthly_payment
								? StorePaymentStatus.PAID
								: StorePaymentStatus.PARTLYPAID,
					}),
				);
			}
		}
	}

	/** pay passed months */
	private async paymentPassedMonths(all_amount: number, store: StoreEntity): Promise<number> {
		const duty_payment = await this.storePaymentRepo.find({
			where: { store, status: Not(StorePaymentStatus.PAID) },
		});

		if (duty_payment[0]) {
			duty_payment.forEach(async (item) => {
				if (all_amount >= item.monthly_payment - item.amount) {
					all_amount = all_amount - (item.monthly_payment - item.amount);
					item.amount = item.monthly_payment;
					item.status = StorePaymentStatus.PAID;
				} else {
					item.amount = all_amount;
					all_amount = 0;
				}

				item.updated_at = Date.now();
				await this.storePaymentRepo.save(item);
			});
		}

		return all_amount;
	}

	// @Cron("* * * * * *")
	private async autoPaymentScheduler() {
		let today = new Date().getDate();

		const store: StoreEntity[] = await this.storeService.getRepository.find({
			where: { payment_day: today },
		});

		let month = new Date().getUTCMonth();
		let year = new Date().getUTCFullYear();

		store.forEach(async (item) => {
			const store_payment: StorePaymentEntity | null = await this.storePaymentRepo.findOne({
				where: {
					for_month: new Date(`${year}-${month + 1}-${item.payment_day}`).getTime(),
				},
			});

			if (!store_payment) {
				await this.storePaymentRepo.save(
					this.storePaymentRepo.create({
						amount: 0,
						monthly_payment: item.monthly_payment,
						for_month: new Date(`${year}-${month + 1}-${item.payment_day}`).getTime(),
						status: StorePaymentStatus.UNPAID,
						store: item,
					}),
				);
			}
		});
	}
}
