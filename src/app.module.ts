import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from './prisma'
import { databaseConfig } from './configs'
import { JwtModule } from '@nestjs/jwt'
import { AdminModule, AuthModule, ClientModule, NotificationModule, PaymentModule, ShopModule } from './modules'

@Module({
	imports: [
		JwtModule.register({ global: true }),
		ConfigModule.forRoot({ isGlobal: true, load: [databaseConfig] }),
		PrismaModule,
		AdminModule,
		AuthModule,
		ClientModule,
		NotificationModule,
		PaymentModule,
		ShopModule,
	],
})
export class AppModule {}
