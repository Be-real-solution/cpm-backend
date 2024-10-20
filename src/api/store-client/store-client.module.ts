import { Module } from "@nestjs/common";
import { StoreClientService } from "./store-client.service";
import { StoreClientController } from "./store-client.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StoreClientEntity } from "src/core/entity";

@Module({
	imports: [TypeOrmModule.forFeature([StoreClientEntity])],
	controllers: [StoreClientController],
	providers: [StoreClientService],
	exports: [StoreClientService],
})
export class StoreClientModule {}
