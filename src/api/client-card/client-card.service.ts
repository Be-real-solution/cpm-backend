import { Injectable } from "@nestjs/common";
import { CreateClientCardDto } from "./dto/create-client-card.dto";
import { UpdateClientCardDto } from "./dto/update-client-card.dto";
import { ClientCardEntity } from "src/core/entity";
import { BaseService } from "src/infrastructure/lib/baseService";
import { InjectRepository } from "@nestjs/typeorm";
import { ClientCardRepository } from "src/core/repository";

@Injectable()
export class ClientCardService extends BaseService<
	CreateClientCardDto,
	UpdateClientCardDto,
	ClientCardEntity
> {
	constructor(
		@InjectRepository(ClientCardEntity) private readonly clientCardRepo: ClientCardRepository,
	) {
		super(clientCardRepo, "ClientCard");
	}
}
