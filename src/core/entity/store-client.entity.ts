import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity } from "src/common/database/BaseEntity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { StoreEntity } from "./store.entity";
import { ClientEntity } from "./client.entity";

@Entity("store_clients")
export class StoreClientEntity extends BaseEntity {
	@ApiProperty({
		name: "status",
		example: true,
		description: "status of store client",
	})
	@Column({ type: "boolean", default: true })
	public status!: boolean;

	@ManyToOne(() => StoreEntity, (store) => store.store_clients)
	@JoinColumn({ name: "store_id" })
	public store!: StoreEntity;

	@ManyToOne(() => ClientEntity, (client) => client.store_clients)
	@JoinColumn({ name: "client_id" })
	public client!: StoreEntity;
}
