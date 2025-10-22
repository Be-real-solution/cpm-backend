import { Repository } from "typeorm";
import { ClientCardEntity } from "../entity";

export type ClientCardRepository = Repository<ClientCardEntity>;
