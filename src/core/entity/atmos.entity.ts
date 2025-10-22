import { BaseEntity } from "src/common/database/BaseEntity";
import { Column, Entity } from "typeorm";

@Entity('atmos')
export class AtmosEntity extends BaseEntity {
  @Column({ type: 'varchar', name: 'token', length: 2048 })
  public token!: string;

  @Column({ type: "bigint", name: 'expire' })
  public expire!: number;
}
