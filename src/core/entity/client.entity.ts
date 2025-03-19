import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity } from "src/common/database/BaseEntity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { StoreEntity } from "./store.entity";
import { ContractEntity } from "./contract.entity";
import { ContractPaymentEntity } from "./contract-payment.entity";

@Entity("clients")
export class ClientEntity extends BaseEntity {
	@ApiProperty({
		name: "first_name",
		example: "Baxrom",
		description: "firstname of client, max 64 lenth",
	})
	@Column({ type: "varchar", length: 64 })
	public first_name!: string;

	@ApiProperty({
		name: "last_name",
		example: "Kamalov",
		description: "lastname of client, max 64 lenth",
	})
	@Column({ type: "varchar", length: 64 })
	public last_name!: string;

	@ApiProperty({
		name: "second_name",
		example: "Alisherovich",
		description: "secondname of client, max 64 lenth",
	})
	@Column({ type: "varchar", length: 64, nullable: true })
	public second_name!: string;

	@ApiProperty({
		name: "passport",
		example: "AB5896347",
		description: "passport of client, max 16 lenth",
	})
	@Column({ type: "varchar", length: 16 })
	public passport!: string;

	@ApiProperty({
		name: "passport_given_by",
		example: "Toshkent shahar chilonzor IIB",
		description: "passport given by of client",
	})
	@Column({ type: "varchar", nullable: true })
	public passport_given_by!: string;

	@ApiProperty({
		name: "rating",
		example: 2,
		description: "rating of client",
	})
	@Column({ type: "int", default: null, nullable: true })
	public rating!: number;

	@ApiProperty({
		name: "pinfl",
		example: "12547896345784",
		description: "pinfl of client, max 32 lenth",
	})
	@Column({ type: "varchar", length: 32 })
	public pinfl!: string;

	@ApiProperty({
		name: "birthday",
		example: 1776272,
		description: "birthday of client",
	})
	@Column({ type: "bigint" })
	public birthday!: number;

	@ApiProperty({
		name: "phone",
		example: "+998999002559",
		description: "phone of client",
	})
	@Column({ type: "varchar", nullable: true })
	public phone!: string;

	@ApiProperty({
		name: "passport_expire_date",
		example: 1765894234,
		description: "passport expire date of client",
	})
	@Column({ type: "bigint" })
	public passport_expire_date!: number;

	@ApiProperty({
		name: "address",
		example: "Toshkent Mirobod 75 uy",
		description: "address of client",
	})
	@Column({ type: "varchar", nullable: true })
	public address!: string;

	@ManyToOne(() => StoreEntity, (store) => store.clients)
	@JoinColumn({ name: "store" })
	public store!: StoreEntity;


	@OneToMany(() => ContractEntity, (contract) => contract.client)
	public contracts!: ContractEntity[];

	@OneToMany(() => ContractPaymentEntity, (contract_payment) => contract_payment.client)
	public contract_payments!: ContractPaymentEntity[];
}
