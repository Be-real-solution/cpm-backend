import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { StoreEntity } from "./store.entity";
import { NotificationEntity } from "./notification.entity";
import { BaseEntity } from "src/common/database/BaseEntity";

@Entity("store_notifications")
export class StoreNotificationEntity extends BaseEntity {
	@Column({ type: "boolean", default: false })
	public is_read!: boolean;

	@ManyToOne(() => StoreEntity, (store) => store.store_notifications)
	@JoinColumn({ name: "store_id" })
	public store!: StoreEntity;

	@ManyToOne(() => NotificationEntity, (notification) => notification.store_notifications)
	@JoinColumn({ name: "notification_id" })
	public notification!: NotificationEntity;
}
