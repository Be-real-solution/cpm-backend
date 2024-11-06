import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity } from "src/common/database/BaseEntity";
import { ContractInitialPaymentType, ContractPaymentMethod, ContractPaymentStatus, ContractStatus } from "src/common/database/Enums";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { ClientEntity } from "./client.entity";
import { StoreEntity } from "./store.entity";
import { ContractProductEntity } from "./contract-product.entity";
import { Transform } from "class-transformer";
import { ContractPaymentEntity } from "./contract-payment.entity";

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
	@ApiProperty({
		name: "status",
		example: "paid",
		description: "status of contract",
	})
	@Column({ type: "enum", enum: ContractStatus, default: ContractStatus.UNPAID })
	public status!: ContractStatus;

	@ApiProperty({
		name: "inn",
		example: "5468713",
		description: "inn of contract, max lenght 16",
	})
	@Column({ type: "varchar", length: 16 })
	public inn!: string;

	@ApiProperty({
		name: "initial_payment_type",
		example: "summa",
		description: "initial_payment_type of contract",
	})
	@Column({ type: "enum", enum: ContractInitialPaymentType })
	public initial_payment_type!: ContractInitialPaymentType;

	@ApiProperty({
		name: "initial_payment_amount",
		example: 100000,
		description: "initial_payment_amount of contract",
	})
	@Column({ type: "decimal", scale: 2 })
	@Transform(({ value }) => parseFloat(value))
	public initial_payment_amount!: number;

	@ApiProperty({
		name: "start_date",
		example: 1827378222,
		description: "start date of contract",
	})
	@Column({ type: "bigint" })
	public start_date!: number;

	@ApiProperty({
		name: "paid_month",
		example: 6,
		description: "paid month of contract",
	})
	@Column({ type: "smallint", default: 0 })
	public paid_month!: number;

	@ApiProperty({
		name: "unpaid_month",
		example: 6,
		description: "unpaid month of contract",
	})
	@Column({ type: "smallint" })
	public unpaid_month!: number;

	@ApiProperty({
		name: "duty_amount",
		example: 55000,
		description: "duty amount of contract",
	})
	@Column({ type: "decimal", scale: 2 })
	public duty_amount!: number;

	@ApiProperty({
		name: "paid_amount",
		example: 6,
		description: "paid amount of contract",
	})
	@Column({ type: "decimal", scale: 2, default: 0 })
	public paid_amount!: number;

	@ApiProperty({
		name: "total_amount",
		example: 6,
		description: "total amount of contract",
	})
	@Column({ type: "decimal", scale: 2 })
	public total_amount!: number;

	@ApiProperty({
		name: "payment_list",
		example: "object",
		description: "payment list of contract payment table",
	})
	@Column({ type: "jsonb", default: {} })
	public payment_list!: JsonData;

	@ManyToOne(() => ClientEntity, (client) => client.contracts)
	@JoinColumn({ name: "client_id" })
	public client!: ClientEntity;

	@ManyToOne(() => StoreEntity, (store) => store.contracts)
	@JoinColumn({ name: "store_id" })
	public store!: StoreEntity;

	@OneToMany(() => ContractProductEntity, (contract_product) => contract_product.contract)
	public contract_products!: ContractProductEntity[];

	@OneToMany(() => ContractPaymentEntity, (contract_payment) => contract_payment.contract)
	public contract_payments!: ContractPaymentEntity[];
}
