import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { BaseEntity } from "src/common/database/BaseEntity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { StoreEntity } from "./store.entity";
import { StorePaymentStatus } from "src/common/database/Enums";
import { AdminEntity } from "./admin.entity";

@Entity('store_payments')
export class StorePaymentEntity extends BaseEntity {
	@ApiProperty({
		name: "amount",
		example: 124232,
		description: "amount of store payment",
	})
	@Transform(({ value }) => parseFloat(value))
	@Column({ type: "decimal", scale: 2 })
	public amount!: number;

	@ApiProperty({
		name: "monthly_payment",
		example: 124232,
		description: "monthly_payment of store payment",
	})
	@Transform(({ value }) => parseFloat(value))
	@Column({ type: "decimal", scale: 2 })
	public monthly_payment!: number;

	@ApiProperty({
		name: "for_month",
		example: 12773636527,
		description: "for_month of store payment",
	})
	@Transform(({ value }) => parseFloat(value))
	@Column({ type: "bigint" })
	public for_month!: number;

	@ApiProperty({
		name: "status",
		example: StorePaymentStatus.UNPAID,
		description: "status of store payment",
	})
	@Transform(({ value }) => parseFloat(value))
	@Column({ type: "enum", enum: StorePaymentStatus, default: StorePaymentStatus.UNPAID })
	public status!: StorePaymentStatus;

	@ManyToOne(() => StoreEntity, (store) => store.payments)
	@JoinColumn({ name: "store_id" })
	public store!: StoreEntity;

	@ManyToOne(() => AdminEntity, (admin) => admin.store_payments)
	@JoinColumn({name: "created_by"})
	public created_by!: AdminEntity
}
