import { Module } from '@nestjs/common'
import { ShopController } from './shop.controller'
import { ShopService } from './shop.service'
import { ShopRepo } from './shop.repo'
import { MulterConfigs } from '../../configs'
import { MulterModule } from '@nestjs/platform-express'

@Module({
	imports: [MulterModule.register(MulterConfigs)],
	controllers: [ShopController],
	providers: [ShopService, ShopRepo],
	exports: [ShopService, ShopRepo],
})
export class ShopModule {}
