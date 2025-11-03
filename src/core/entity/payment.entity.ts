import { BaseEntity } from "src/common/database/BaseEntity";
import { Column, Entity } from "typeorm";

@Entity("payments")
export class PaymentEntity extends BaseEntity {
  @Column({
    name: "amount",
    type: "bigint"
  })
  public amount!: number;

  @Column()
  public store_id!: string;

  @Column()
  public client_id!: string;

  @Column()
  public card_id!: string;

  @Column()
  public transaction_id!: string;

  @Column()
  public result!: string;

  @Column()
  public data!: string;
}
