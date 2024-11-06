import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity } from "src/common/database/BaseEntity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { StoreEntity } from "./store.entity";
import { ClientEntity } from "./client.entity";
import { ContractEntity } from "./contract.entity";
import { ContractPaymentMethod } from "src/common/database/Enums";

@Entity("contract_payments")
export class ContractPaymentEntity extends BaseEntity {
	@ApiProperty({
		name: "amount",
		example: 12323,
		description: "amount of contract payment",
	})
	@Column({ type: "decimal", scale: 2 })
	public amount!: number;

	@ApiProperty({
		name: "method",
		example: "cash",
		examples: ContractPaymentMethod,
		description: "method of contract payment",
	})
	@Column({ type: "enum", enum: ContractPaymentMethod, nullable: true })
	public method!: ContractPaymentMethod;

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
