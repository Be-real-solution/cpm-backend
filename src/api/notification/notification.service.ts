import { Injectable } from "@nestjs/common";
import { CreateNotificationDto } from "./dto/create-notification.dto";
import { UpdateNotificationDto } from "./dto/update-notification.dto";
import { InjectRepository } from "@nestjs/typeorm";
import {
	AdminEntity,
	NotificationEntity,
	StoreEntity,
	StoreNotificationEntity,
} from "src/core/entity";
import { NotificationRepository, StoreNotificationRepository } from "src/core/repository";
import { BaseService } from "src/infrastructure/lib/baseService";
import { IResponse } from "src/common/type";
import { Roles } from "src/common/database/Enums";
import { responseByLang } from "src/infrastructure/lib/prompts/successResponsePrompt";
import { DataSource, FindOptionsWhereProperty, ILike } from "typeorm";
import { FilterDto } from "src/common/dto/filter.dto";

@Injectable()
export class NotificationService extends BaseService<
	CreateNotificationDto,
	UpdateNotificationDto,
	NotificationEntity
> {
	constructor(
		@InjectRepository(NotificationEntity)
		private readonly notificationRepo: NotificationRepository,
		@InjectRepository(StoreNotificationEntity)
		private readonly storeNotificationRepo: StoreNotificationRepository,
		private readonly datasource: DataSource,
	) {
		super(notificationRepo, "Notification");
	}

	/** create notification api for admins */
	public async create(dto: CreateNotificationDto, lang: string) {
		if (!dto.stores) {
			return await super.create(dto, lang);
		}
		const transaction = this.datasource.createQueryRunner();
		await transaction.connect();
		await transaction.startTransaction();

		let notification: any;
		try {
			notification = await transaction.manager.save(
				"notifications",
				transaction.manager.create("notifications", {
					title: dto.title,
					description: dto.description,
				}),
			);

			dto.stores.forEach(async (item) => {
				await transaction.manager.save(
					"store_notifications",
					transaction.manager.create("store_notifications", {
						store: { id: item.id },
						notification,
					}),
				);
			});

			await transaction.commitTransaction();
		} catch (err) {
			await transaction.rollbackTransaction();
			throw err;
		} finally {
			await transaction.release();
		}

		const message = responseByLang("create", lang);

		return { status_code: 201, data: notification, message };
	}

	/** find all notification api for store and admin */
	public async findAllNotification(
		lang: string,
		query: FilterDto,
		user: StoreEntity | AdminEntity,
	): Promise<IResponse<NotificationEntity[]>> {
		let notification: NotificationEntity[] | [];

		let where_condition: FindOptionsWhereProperty<NotificationEntity>;

		if (query.search) {
			where_condition =
				user.role == Roles.STORE_ADMIN
					? {
							title: ILike(`%${query.search}%`),
							is_deleted: false,
							store_notifications: { store: user, is_deleted: false },
						}
					: { title: ILike(`%${query.search}%`), is_deleted: false };
		} else {
			where_condition =
				user.role == Roles.STORE_ADMIN
					? {
							is_deleted: false,
							store_notifications: { store: user, is_deleted: false },
						}
					: { is_deleted: false };
		}

		return this.findAllWithPagination(lang, {
			where: where_condition,
			relations:
				user.role == Roles.STORE_ADMIN
					? { store_notifications: true }
					: { store_notifications: { store: true } },
			take: query.page_size,
			skip: query.page,
			order: { created_at: "DESC" },
		});
	}

	/** find one notification api */
	public async findOne(
		id: string,
		lang: string,
		user: AdminEntity | StoreEntity,
	): Promise<IResponse<NotificationEntity>> {
		let notification: NotificationEntity;
		if (user.role == Roles.STORE_ADMIN) {
			notification = await this.findOneById(id, lang, {
				where: {
					is_deleted: false,
					store_notifications: { store: user, is_deleted: false },
				},
				relations: { store_notifications: true },
			}).then((res) => res.data);

			if (notification.store_notifications[0]?.is_read == false) {
				await this.storeNotificationRepo.update(notification.store_notifications[0].id, {
					is_read: true,
				});
			}
		} else {
			notification = await this.findOneById(id, lang).then((res) => res.data);
		}

		return { status_code: 200, data: notification, message: responseByLang("get_one", lang) };
	}

	/** update notification api for admins */
	public async update(
		id: string,
		dto: UpdateNotificationDto,
		lang: string,
	): Promise<IResponse<{}>> {
		const { data: notification } = await this.findOneById(id, lang, {
			relations: { store_notifications: { store: true } },
		});

		if (dto.stores) {
			const new_stores = dto.stores.filter(
				(item) =>
					!notification.store_notifications.some((value) => value.store.id == item.id),
			);

			const remove_stores = notification.store_notifications.filter(
				(item) => !dto.stores?.some((value) => value.id == item.store.id),
			);

			if (new_stores.length) {
				new_stores.forEach(async (item) => {
					await this.storeNotificationRepo.save(
						this.storeNotificationRepo.create({
							store: {
								id: item.id,
							},
							notification,
						}),
					);
				});
			}

			if (remove_stores.length) {
				remove_stores.forEach(async (item) => {
					await this.storeNotificationRepo.delete(item.id);
				});
			}
		}

		return super.update(id, { title: dto.title, description: dto.description }, lang);
	}

}
