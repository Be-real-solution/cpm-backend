import { BaseEntity } from "src/common/database/BaseEntity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { StoreEntity } from "./store.entity";
import { ContractEntity } from "./contract.entity";
import { ContractPaymentEntity } from "./contract-payment.entity";
import { ClientCardEntity } from "./client-card.entity";

@Entity("clients")
export class ClientEntity extends BaseEntity {
	@Column({ type: "varchar", length: 64 })
	public first_name!: string;

	@Column({ type: "varchar", length: 64 })
	public last_name!: string;

	@Column({ type: "varchar", length: 64, nullable: true })
	public second_name!: string;

	@Column({ type: "varchar", length: 16 })
	public passport!: string;

	@Column({ type: "varchar", nullable: true })
	public passport_given_by!: string;

	@Column({ type: "int", default: null, nullable: true })
	public rating!: number;

	@Column({ type: "varchar", length: 32 })
	public pinfl!: string;

	@Column({ type: "bigint" })
	public birthday!: number;

	@Column({ type: "varchar", nullable: true })
	public phone!: string;

	@Column({ type: "bigint" })
	public passport_expire_date!: number;

	@Column({ type: "varchar", nullable: true })
	public address!: string;

	@ManyToOne(() => StoreEntity, (store) => store.clients)
	@JoinColumn({ name: "store" })
	public store!: StoreEntity;

	@OneToMany(() => ContractEntity, (contract) => contract.client)
	public contracts!: ContractEntity[];

	@OneToMany(() => ContractPaymentEntity, (contract_payment) => contract_payment.client)
	public contract_payments!: ContractPaymentEntity[];

	@OneToMany(() => ClientCardEntity, (client_card) => client_card.client)
	public cards!: ClientCardEntity[];
}
