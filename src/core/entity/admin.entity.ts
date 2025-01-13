import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity } from "src/common/database/BaseEntity";
import { Roles } from "src/common/database/Enums";
import { Column, Entity, Index, OneToMany } from "typeorm";
import { StoreEntity } from "./store.entity";
import { StorePaymentEntity } from "./store-payment.entity";

@Entity("admins")
export class AdminEntity extends BaseEntity {
	@ApiProperty({ name: "fullname", example: "Akmal", description: "fullname of admin" })
	@Column({ type: "varchar", length: 64 })
	public fullname!: string;

	@ApiProperty({ name: "username", example: "akmal123", description: "username of admin" })
	@Index({ unique: true, where: "is_deleted = false" })
	@Column({ type: "varchar", length: 20 })
	public username!: string;

	@ApiProperty({
		name: "phone_number",
		example: "+998999002559",
		description: "phone number of admin",
	})
	@Column({ type: "varchar", length: 20 })
	public phone_number!: string;

	@ApiProperty({ name: "password", example: "12345", description: "password of admin" })
	@Column({ type: "varchar" })
	public password!: string;

	@ApiProperty({ name: "role", example: "admin", description: "role of admin" })
	@Column({ type: "enum", enum: [Roles.SUPER_ADMIN, Roles.ADMIN], default: Roles.ADMIN })
	public role!: Roles;

	@ApiProperty({
		name: "hashed_token",
		example: "hashed token",
		description: "hashed token of admin",
	})
	@Column({ type: "varchar", nullable: true })
	public hashed_token!: string;

	@OneToMany(() => StoreEntity, (store) => store.created_by)
	public stores!: StoreEntity[];

	@OneToMany(() => StorePaymentEntity, (store_payment) => store_payment.created_by)
	public store_payments!: StorePaymentEntity[];
}
