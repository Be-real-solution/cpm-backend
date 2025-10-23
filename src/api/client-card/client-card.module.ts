import { Module } from "@nestjs/common";
import { ClientCardService } from "./client-card.service";
import { ClientCardController } from "./client-card.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClientCardEntity } from "src/core/entity";

@Module({
	imports: [TypeOrmModule.forFeature([ClientCardEntity])],
	controllers: [ClientCardController],
	providers: [ClientCardService],
	exports: [ClientCardService],
})
export class ClientCardModule {}
