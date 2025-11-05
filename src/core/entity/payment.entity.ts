import { BaseEntity } from "src/common/database/BaseEntity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { ContractPaymentEntity } from "./contract-payment.entity";

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

  @Column()
  public contract_payment_id!: string;

  @ManyToOne(() => ContractPaymentEntity, (contract_payment) => contract_payment.payments)
  @JoinColumn({ name: "contract_payment_id" })
  public contract_payment!: ContractPaymentEntity;
}
