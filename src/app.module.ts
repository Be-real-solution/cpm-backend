import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from './prisma'
import { databaseConfig } from './configs'
import { JwtModule } from '@nestjs/jwt'
import { AdminModule, AuthModule, ClientModule, ContractModule, NotificationModule, PaymentModule, ShopModule } from './modules'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'

@Module({
	imports: [
		ServeStaticModule.forRoot(
			{ rootPath: join(__dirname, '..', 'uploads', 'images'), serveRoot: '/uploads/images' },
			{ rootPath: join(__dirname, '..', 'uploads', 'videos'), serveRoot: '/uploads/videos' },
			{ rootPath: join(__dirname, '..', 'uploads', 'files'), serveRoot: '/uploads/files' },
		),
		JwtModule.register({ global: true }),
		ConfigModule.forRoot({ isGlobal: true, load: [databaseConfig] }),
		PrismaModule,
		AdminModule,
		AuthModule,
		ClientModule,
		ContractModule,
		NotificationModule,
		PaymentModule,
		ShopModule,
	],
})
export class AppModule {}
