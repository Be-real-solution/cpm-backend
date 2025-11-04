import { BaseEntity } from "src/common/database/BaseEntity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { StoreEntity } from "./store.entity";
import { ClientEntity } from "./client.entity";
import { ContractEntity } from "./contract.entity";
import { ContractPaymentMethod, ContractPaymentStatus } from "src/common/database/Enums";

@Entity("contract_payments")
export class ContractPaymentEntity extends BaseEntity {
	@Column({ type: "decimal", scale: 2 })
	public amount!: number;

	@Column({ type: "bigint", default: 0 })
	public amount_tiyn!: number;

	@Column({ type: "enum", enum: ContractPaymentStatus, default: ContractPaymentStatus.UNPAID })
	public status!: ContractPaymentStatus;

	@Column({ type: "enum", enum: ContractPaymentMethod, default: ContractPaymentMethod.NOT_SELECTED })
	public method!: ContractPaymentMethod;

	@Column({ type: "date" })
	public payment_date!: Date;

	@ManyToOne(() => StoreEntity, (store) => store.contract_payments)
	@JoinColumn({ name: "store_id" })
	public store!: StoreEntity;

	@ManyToOne(() => ClientEntity, (client) => client.contract_payments)
	@JoinColumn({ name: "client_id" })
	public client!: ClientEntity;

	@ManyToOne(() => ContractEntity, (contract) => contract.contract_payments)
	@JoinColumn({ name: "contract_id" })
	public contract!: ContractEntity;
}
