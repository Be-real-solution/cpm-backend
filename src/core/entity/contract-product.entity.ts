import { ContractProductUnit } from "src/common/database/Enums";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ContractEntity } from "./contract.entity";

@Entity("contract_products")
export class ContractProductEntity {
	@PrimaryGeneratedColumn("uuid")
	public id!: string;


	@Column({ type: "varchar" })
	public name!: string;


	@Column({ type: "enum", enum: ContractProductUnit })
	public unit!: ContractProductUnit;


	@Column({ type: "smallint" })
	public quantity!: number;


	@Column({ type: "decimal", scale: 2 })
	public price!: number;

	@Column({ type: "bigint", default: Date.now() })
	public created_at!: number;

	@ManyToOne(() => ContractEntity, (contract) => contract.contract_products, {
		onDelete: "CASCADE",
	})
	@JoinColumn({ name: "contract_id" })
	public contract!: ContractEntity;
}
