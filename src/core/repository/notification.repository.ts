import { Repository } from "typeorm";
import { NotificationEntity } from "../entity";

export type NotificationRepository = Repository<NotificationEntity>;
