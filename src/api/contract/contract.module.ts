import { Module } from "@nestjs/common";
import { ContractService } from "./contract.service";
import { ContractController } from "./contract.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ContractEntity, ContractProductEntity } from "src/core/entity";
import { ClientModule } from "../client/client.module";

@Module({
	imports: [TypeOrmModule.forFeature([ContractEntity, ContractProductEntity]), ClientModule],
	controllers: [ContractController],
	providers: [ContractService],
	exports: [ContractService],
})
export class ContractModule {}
