import { BaseEntity } from "src/common/database/BaseEntity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { ContractPaymentEntity } from "./contract-payment.entity";

@Entity("transactions")
export class TransactionEntity extends BaseEntity {
   @Column({ nullable: true })
   public transaction_id!: string;
   
   @Column({ nullable: true })
   public store_id!: string;
   
   @Column({ nullable: true })
   public amount!: string;
   
   @Column({ nullable: true })
   public sign!: string;
   
   @Column({ nullable: true })
   public transaction_time!: string;
   
   @Column({ nullable: true })
   public invoice!: string;


}
