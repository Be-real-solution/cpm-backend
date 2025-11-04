import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity } from "src/common/database/BaseEntity";
import { Column, Entity, OneToMany } from "typeorm";
import { StoreNotificationEntity } from "./store-notification.entity";

@Entity("notifications")
export class NotificationEntity extends BaseEntity {
	@Column({ type: "varchar" })
	public title!: string;

	@Column({ type: "varchar", length: 500 })
	public description!: string;

	@OneToMany(
		() => StoreNotificationEntity,
		(store_notification) => store_notification.notification,
	)
	public store_notifications!: StoreNotificationEntity[];
}
