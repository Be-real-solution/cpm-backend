import { Repository } from "typeorm";
import { ClientEntity } from "../entity";

export type ClientRepository = Repository<ClientEntity>;
