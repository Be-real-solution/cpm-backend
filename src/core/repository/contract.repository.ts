import { Repository } from "typeorm";
import { ContractEntity } from "../entity";

export type ContractRepository = Repository<ContractEntity>;
