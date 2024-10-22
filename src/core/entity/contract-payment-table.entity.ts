import { ApiProperty } from "@nestjs/swagger";
import { ContractPaymentMethod, ContractPaymentStatus, ContractProductUnit } from "src/common/database/Enums";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ContractEntity } from "./contract.entity";

@Entity("contract_payment_tables")
export class ContractPaymentTableEntity {
	@PrimaryGeneratedColumn("uuid")
	public id!: string;

	@ApiProperty({
		name: "date",
		example: 1627362737,
		description: "date of contract payment table",
	})
	@Column({ type: "bigint", default: Date.now() })
	public date!: number;

	@ApiProperty({
		name: "amount",
		example: 500000,
		description: "amount of contract payment table",
	})
	@Column({ type: "decimal", scale: 2 })
	public amount!: number;

	@ApiProperty({
		name: "method",
		example: "cash",
		examples: ContractPaymentMethod,
		description: "method of contract payment table",
	})
	@Column({ type: "enum", enum: ContractPaymentMethod })
	public method!: ContractPaymentMethod;

	@ApiProperty({
		name: "status",
		example: "paid",
		description: "status of contract payment table",
	})
	@Column({ type: "enum", enum: ContractPaymentStatus })
	public status!: ContractPaymentStatus;

	@ApiProperty({
		name: "created_at",
		example: 12773929,
		description: "created at of contract payment table",
	})
	@Column({ type: "bigint", default: Date.now() })
	public created_at!: number;

	@ManyToOne(() => ContractEntity, (contract) => contract.contract_payment_tables)
	@JoinColumn({ name: "contract_id" })
	public contract!: ContractEntity;
}
