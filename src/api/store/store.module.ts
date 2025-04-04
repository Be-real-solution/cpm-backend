import { Module } from "@nestjs/common";
import { StoreService } from "./store.service";
import { StoreController } from "./store.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StoreEntity } from "src/core/entity";

@Module({
	imports: [TypeOrmModule.forFeature([StoreEntity])],
	controllers: [StoreController],
	providers: [StoreService],
	exports: [StoreService],
})
export class StoreModule {}
