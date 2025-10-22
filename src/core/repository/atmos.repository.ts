import { Repository } from "typeorm";
import { AtmosEntity } from "../entity";

export type AtmosRepository = Repository<AtmosEntity>;
