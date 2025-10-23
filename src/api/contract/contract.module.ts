import { Module } from "@nestjs/common";
import { ContractService } from "./contract.service";
import { ContractController } from "./contract.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ContractEntity, ContractProductEntity } from "src/core/entity";
import { ClientModule } from "../client/client.module";
import { ClientCardModule } from "../client-card/client-card.module";

@Module({
	imports: [TypeOrmModule.forFeature([ContractEntity, ContractProductEntity]), ClientModule, ClientCardModule],
	controllers: [ContractController],
	providers: [ContractService],
	exports: [ContractService],
})
export class ContractModule {}
