import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity } from "src/common/database/BaseEntity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { AdminEntity } from "./admin.entity";
import { ClientEntity } from "./client.entity";
import { StoreClientEntity } from "./store-client.entity";
import { ContractEntity } from "./contract.entity";
import { Roles } from "src/common/database/Enums";
import { StorePaymentEntity } from "./store-payment.entity";
import { ContractPaymentEntity } from "./contract-payment.entity";
import { NotificationEntity } from "./notification.entity";
import { StoreNotificationEntity } from "./store-notification.entity";

@Entity("stores")
export class StoreEntity extends BaseEntity {
	@ApiProperty({ name: "name", example: "Idea", description: "name of store" })
	@Column({ type: "varchar" })
	public name!: string;

	@ApiProperty({
		name: "phone",
		example: "+998901234567",
		description: "phone number of store",
	})
	@Column({ type: "varchar", length: 20 })
	public phone!: string;

	@ApiProperty({
		name: "address",
		example: "Toshkent Mirobod 75 uy",
		description: "address of store",
	})
	@Column({ type: "varchar" })
	public address!: string;

	@ApiProperty({
		name: "director",
		example: "Jalilov Qaxxor",
		description: "director of store",
	})
	@Column({ type: "varchar", length: 64 })
	public director!: string;

	@ApiProperty({
		name: "manager",
		example: "Jalilov Qaxxor",
		description: "manager of store",
	})
	@Column({ type: "varchar", length: 64 })
	public manager!: string;

	@ApiProperty({
		name: "username",
		example: "Idea123",
		description: "username of store",
	})
	@Column({ type: "varchar", unique: true, length: 32 })
	public username!: string;

	@ApiProperty({
		name: "password",
		example: "Idea123",
		description: "password of store",
	})
	@Column({ type: "varchar" })
	public password!: string;

	@ApiProperty({
		name: "payment_day",
		example: 12,
		description: "payment day in the month of store",
	})
	@Column({ type: "smallint" })
	public payment_day!: number;

	@ApiProperty({
		name: "monthly_payment",
		example: 170000,
		description: "monthly payment for a month of store",
	})
	@Column({ type: "decimal", scale: 2 })
	public monthly_payment!: number;

	@ApiProperty({
		name: "responsible_person",
		example: "Jalilov Qaxxor",
		description: "responsible_person of store",
	})
	@Column({ type: "varchar", length: 64 })
	public responsible_person!: string;

	@ApiProperty({
		name: "second_phone",
		example: "+998999007890",
		description: "second phone of store",
	})
	@Column({ type: "varchar", length: 20 })
	public second_phone!: string;

	@ApiProperty({
		name: "order",
		example: 1,
		description: "order of store auto created",
	})
	@Column({ type: "int4" })
	public order!: number;

	@ApiProperty({
		name: "role",
		example: "store_admin",
		description: "role of store auto created",
	})
	@Column({ type: "enum", enum: Roles, default: Roles.STORE_ADMIN })
	public role!: Roles;

	@ManyToOne(() => AdminEntity, (admin) => admin.stores)
	@JoinColumn({ name: "created_by" })
	public created_by!: AdminEntity;

	@OneToMany(() => ClientEntity, (client) => client.store)
	public clients!: ClientEntity[];

	@OneToMany(() => StoreClientEntity, (store_client) => store_client.store)
	public store_clients!: StoreClientEntity[];

	@OneToMany(() => ContractEntity, (contract) => contract.store)
	public contracts!: ContractEntity[];

	@OneToMany(() => StorePaymentEntity, (store_payment) => store_payment.store)
	public payments!: StorePaymentEntity[];

	@OneToMany(() => ContractPaymentEntity, (contract_payment) => contract_payment.store)
	public contract_payments!: ContractPaymentEntity[];

	@OneToMany(() => StoreNotificationEntity, (store_notification) => store_notification.store)
	public store_notifications!: StoreNotificationEntity[];
}
