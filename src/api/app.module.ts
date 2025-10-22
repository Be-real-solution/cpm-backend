import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ScheduleModule as NestScheduleModule } from "@nestjs/schedule";
import { TypeOrmModule } from "@nestjs/typeorm";
import { config } from "src/config";
import { CorrelatorMiddleware } from "../infrastructure/middleware/correlator";
import { AdminModule } from "./admin/admin.module";
import { AuthModule } from "./auth/auth.module";
import { StoreModule } from './store/store.module';
import { ClientModule } from './client/client.module';
import { ContractModule } from './contract/contract.module';
import { StorePaymentModule } from './store-payment/store-payment.module';
import { ContractPaymentModule } from './contract-payment/contract-payment.module';
import { NotificationModule } from './notification/notification.module';
import { PaymentModule } from './payment/payment.module';
import { AtmosModule } from './atmos/atmos.module';

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
		ContractModule,
		StorePaymentModule,
		ContractPaymentModule,
		NotificationModule,
		PaymentModule,
		AtmosModule,
	],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(CorrelatorMiddleware).forRoutes("*");
	}
}
