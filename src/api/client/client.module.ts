import { Module } from "@nestjs/common";
import { ClientService } from "./client.service";
import { ClientController } from "./client.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClientEntity } from "src/core/entity";
import { ClientCardEntity } from "src/core/entity";

@Module({
	imports: [TypeOrmModule.forFeature([ClientEntity, ClientCardEntity])],
	controllers: [ClientController],
	providers: [ClientService],
	exports: [ClientService],
})
export class ClientModule {}
