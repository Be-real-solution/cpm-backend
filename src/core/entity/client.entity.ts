import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity } from "src/common/database/BaseEntity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { StoreEntity } from "./store.entity";
import { StoreClientEntity } from "./store-client.entity";
import { ContractEntity } from "./contract.entity";

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
		name: "rating",
		example: 2,
		description: "rating of client",
	})
	@Column({ type: "int", default: 0 })
	public rating!: number;

	@ApiProperty({
		name: "PINFL",
		example: "12547896345784",
		description: "PINFL of client, max 32 lenth",
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
		name: "passport_expire_date",
		example: 1765894234,
		description: "passport expire date of client",
	})
	@Column({ type: "bigint" })
	public passport_expire_date!: number;

	@ManyToOne(() => StoreEntity, (store) => store.clients)
	@JoinColumn({ name: "created_by" })
	public created_by!: StoreEntity;

	@OneToMany(() => StoreClientEntity, (store_client) => store_client.client)
	public store_clients!: StoreClientEntity[];

	@OneToMany(() => ContractEntity, (contract) => contract.client)
	public contracts!: ContractEntity[]
}
