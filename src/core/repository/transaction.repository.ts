import { Repository } from "typeorm";
import { TransactionEntity } from "../entity";

export type TransactionRepository = Repository<TransactionEntity>;
