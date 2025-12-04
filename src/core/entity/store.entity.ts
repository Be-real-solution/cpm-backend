import { BaseEntity } from "src/common/database/BaseEntity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { AdminEntity } from "./admin.entity";
import { ClientEntity } from "./client.entity";
import { ContractEntity } from "./contract.entity";
import { Roles } from "src/common/database/Enums";
import { StorePaymentEntity } from "./store-payment.entity";
import { ContractPaymentEntity } from "./contract-payment.entity";
import { NotificationEntity } from "./notification.entity";
import { StoreNotificationEntity } from "./store-notification.entity";

@Entity("stores")
export class StoreEntity extends BaseEntity {
	@Column({ type: "varchar" })
	public name!: string;

	@Column({ type: "varchar", length: 20 })
	public phone!: string;

	@Column({ type: "varchar", nullable: true })
	public region!: string;

	@Column({ type: "varchar" })
	public address!: string;

	@Column({ type: "varchar", length: 64 })
	public director!: string;

	@Column({ type: "varchar", length: 64 })
	public manager!: string;

	@Column({ type: "varchar", unique: true, length: 32 })
	public username!: string;

	@Column({ type: "varchar" })
	public password!: string;

	@Column({ type: "varchar", nullable: true })
	public bank_account_number!: string;

	@Column({ type: "varchar", nullable: true })
	public bank_address!: string;

	@Column({ type: "varchar", nullable: true })
	public mfo!: string;

	@Column({ type: "varchar", nullable: true })
	public stir!: string;

	@Column({ type: "varchar", nullable: true })
	public atmos_id!: string;

	@Column({ type: "smallint" })
	public payment_day!: number;

	@Column({ type: "decimal", scale: 2 })
	public monthly_payment!: number;

	@Column({ type: "varchar", length: 64 })
	public responsible_person!: string;

	@Column({ type: "varchar", length: 20 })
	public second_phone!: string;

	@Column({ type: "int4" })
	public order!: number;

	@Column({ type: "varchar", nullable: true })
	public store_contract_file_url!: string;

	@Column({ type: "enum", enum: Roles, default: Roles.STORE_ADMIN })
	public role!: Roles;

	@Column({ type: "varchar", nullable: true })
	public hashed_token!: string;

	@ManyToOne(() => AdminEntity, (admin) => admin.stores)
	@JoinColumn({ name: "created_by" })
	public created_by!: AdminEntity;

	@OneToMany(() => ClientEntity, (client) => client.store)
	public clients!: ClientEntity[];

	@OneToMany(() => ContractEntity, (contract) => contract.store)
	public contracts!: ContractEntity[];

	@OneToMany(() => StorePaymentEntity, (store_payment) => store_payment.store)
	public payments!: StorePaymentEntity[];

	@OneToMany(() => ContractPaymentEntity, (contract_payment) => contract_payment.store)
	public contract_payments!: ContractPaymentEntity[];

	@OneToMany(() => StoreNotificationEntity, (store_notification) => store_notification.store)
	public store_notifications!: StoreNotificationEntity[];
}
