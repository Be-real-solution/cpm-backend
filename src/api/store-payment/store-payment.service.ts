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
		});

		const store_payment = await this.storePaymentRepo.save(
			this.storePaymentRepo.create({
				amount: dto.amount,
				for_month: dto.for_month,
				monthly_payment: store.monthly_payment,
				created_at: Date.now(),
				created_by: admin,
				store: store,
				status:
					dto.amount == store.monthly_payment
						? StorePaymentStatus.PAID
						: dto.amount > 0 && dto.amount < store.monthly_payment
							? StorePaymentStatus.PARTLYPAID
							: StorePaymentStatus.UNPAID,
			}),
		);

		return { status_code: 201, data: store_payment, message: responseByLang("create", lang) };
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
						for_month: new Date().getTime(),
						status: StorePaymentStatus.UNPAID,
						store: item,
					}),
				);
			}
		});
	}
}
