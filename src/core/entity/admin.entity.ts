import { BaseEntity } from "src/common/database/BaseEntity";
import { Roles } from "src/common/database/Enums";
import { Column, Entity, Index, OneToMany } from "typeorm";
import { StoreEntity } from "./store.entity";
import { StorePaymentEntity } from "./store-payment.entity";

@Entity("admins")
export class AdminEntity extends BaseEntity {
	@Column({ type: "varchar", length: 64 })
	public fullname!: string;

	@Index({ unique: true, where: "is_deleted = false" })
	@Column({ type: "varchar", length: 20 })
	public username!: string;

	@Column({ type: "varchar", length: 20 })
	public phone_number!: string;

	@Column({ type: "varchar" })
	public password!: string;

	@Column({ type: "enum", enum: [Roles.SUPER_ADMIN, Roles.ADMIN], default: Roles.ADMIN })
	public role!: Roles;

	@Column({ type: "varchar", nullable: true })
	public hashed_token!: string;

	@OneToMany(() => StoreEntity, (store) => store.created_by)
	public stores!: StoreEntity[];

	@OneToMany(() => StorePaymentEntity, (store_payment) => store_payment.created_by)
	public store_payments!: StorePaymentEntity[];
}
