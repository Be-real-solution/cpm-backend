import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID } from "class-validator";
import { BaseEntity } from "src/common/database/BaseEntity";
import { ClientEntity, ContractEntity } from "src/core/entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";

@Entity("client_cards")
export class ClientCardEntity extends BaseEntity {
	@ManyToOne(() => ClientEntity, (client) => client.cards)
	public client!: ClientEntity;

	@Column({ type: "int", name: "card_id" })
	public card_id!: number;

	@Column({ type: "varchar", name: "pan", length: 16 })
	public pan!: string;

	@Column({ type: "varchar", name: "expiry", length: 7 })
	public expiry!: string;

	@Column({ type: "varchar", name: "card_holder", length: 64 })
	public card_holder!: string;

	@Column({ type: "bigint", name: "balance", default: 0 })
	public balance!: number;

	@Column({ type: "varchar", name: "phone", length: 16 })
	public phone!: string;

	@Column({ type: "varchar", name: "card_token", length: 64 })
	public card_token!: string;

	@OneToMany(() => ContractEntity, (contract) => contract.client_card)
	public contracts!: ContractEntity[];
}
