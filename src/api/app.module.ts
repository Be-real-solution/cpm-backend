import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ScheduleModule as NestScheduleModule } from "@nestjs/schedule";
import { TypeOrmModule } from "@nestjs/typeorm";
import { config } from "src/config";
import { CorrelatorMiddleware } from "../infrastructure/middleware/correlator";
import { AdminModule } from "./admin/admin.module";
import { AuthModule } from "./auth/auth.module";
import { StoreModule } from './store/store.module';
import { ClientModule } from './client/client.module';
import { StoreClientModule } from './store-client/store-client.module';
import { ContractModule } from './contract/contract.module';

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: "postgres",
			url: config.DB_URL,
			entities: ["dist/core/entity/*.entity{.ts,.js}"],
			synchronize: true, // TODO: set to false in production
		}),
		NestScheduleModule.forRoot(),
		AuthModule,
		AdminModule,
		StoreModule,
		ClientModule,
		StoreClientModule,
		ContractModule,
	],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(CorrelatorMiddleware).forRoutes("*");
	}
}