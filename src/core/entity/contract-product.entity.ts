import { ApiProperty } from "@nestjs/swagger";
import { ContractProductUnit } from "src/common/database/Enums";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ContractEntity } from "./contract.entity";

@Entity("contract_products")
export class ContractProductEntity {
	@PrimaryGeneratedColumn("uuid")
	public id!: string;

	@ApiProperty({
		name: "name",
		example: "Xolodelnik",
		description: "name of contract product",
	})
	@Column({ type: "varchar" })
	public name!: string;

	@ApiProperty({
		name: "unit",
		example: "pcs",
		description: "unit of contract product",
	})
	@Column({ type: "enum", enum: ContractProductUnit })
	public unit!: ContractProductUnit;

	@ApiProperty({
		name: "quantity",
		example: 6,
		description: "quantity of contract product",
	})
	@Column({ type: "smallint" })
	public quantity!: number;

	@ApiProperty({
		name: "price",
		example: 60000,
		description: "price of contract product",
	})
	@Column({ type: "decimal", scale: 2 })
	public price!: number;

	@ApiProperty({
		name: "created_at",
		example: 12773929,
		description: "created at of contract product",
	})
	@Column({ type: "bigint", default: Date.now() })
	public created_at!: number;

	@ManyToOne(() => ContractEntity, (contract) => contract.contract_products, {
		onDelete: "CASCADE",
	})
	@JoinColumn({ name: "contract_id" })
	public contract!: ContractEntity;
}
