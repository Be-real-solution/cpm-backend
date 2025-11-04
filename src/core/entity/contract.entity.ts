import { Transform } from "class-transformer";
import { BaseEntity } from "src/common/database/BaseEntity";
import {
	ContractPaymentMethod,
	ContractPaymentStatus,
	ContractStatus,
} from "src/common/database/Enums";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { ClientEntity } from "./client.entity";
import { ContractPaymentEntity } from "./contract-payment.entity";
import { ContractProductEntity } from "./contract-product.entity";
import { StoreEntity } from "./store.entity";
import { ClientCardEntity } from "./client-card.entity";

export type JsonData = {
	payment_data: {
		id: number;
		date: number;
		price: number;
		method: ContractPaymentMethod;
		status: ContractPaymentStatus;
	}[];
	first_name: string;
	last_name: string;
	total: number;
};

@Entity("contracts")
export class ContractEntity extends BaseEntity {
	@Column({ type: "enum", enum: ContractStatus, default: ContractStatus.UNPAID })
	public status!: ContractStatus;

	@Column({ type: "bigint", nullable: true })
	public contract_number!: number;

	@Column({ type: "varchar", length: 16 })
	public inn!: string;

	@Column({ type: "smallint", nullable: true })
	public initial_payment_percent!: number;

	@Column({ type: "decimal", scale: 2 })
	@Transform(({ value }) => parseFloat(value))
	public initial_payment_amount!: number;

	@Column({ type: "bigint" })
	public start_date!: number;

	@Column({ type: "smallint", default: 0 })
	public paid_month!: number;

	@Column({ type: "smallint" })
	public unpaid_month!: number;

	@Column({ type: "decimal", scale: 2 })
	public duty_amount!: number;

	@Column({ type: "decimal", scale: 2, default: 0 })
	public paid_amount!: number;

	@Column({ type: "decimal", scale: 2 })
	public total_amount!: number;

	@Column({ type: "varchar", nullable: true })
	public contract_file_url!: string;

	@Column({ type: "jsonb", default: {} })
	public payment_list!: JsonData;

	@ManyToOne(() => ClientEntity, (client) => client.contracts)
	@JoinColumn({ name: "client_id" })
	public client!: ClientEntity;

	@ManyToOne(() => StoreEntity, (store) => store.contracts)
	@JoinColumn({ name: "store_id" })
	public store!: StoreEntity;

	@ManyToOne(() => ClientCardEntity, (client_card) => client_card.client)
	@JoinColumn({ name: "client_card_id" })
	public client_card!: ClientCardEntity;

	@OneToMany(() => ContractProductEntity, (contract_product) => contract_product.contract)
	public contract_products!: ContractProductEntity[];

	@OneToMany(() => ContractPaymentEntity, (contract_payment) => contract_payment.contract)
	public contract_payments!: ContractPaymentEntity[];
}
