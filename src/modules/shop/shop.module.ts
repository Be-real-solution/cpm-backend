import { Module } from '@nestjs/common'
import { ShopController } from './shop.controller'
import { ShopService } from './shop.service'
import { ShopRepo } from './shop.repo'

@Module({
	imports: [],
	controllers: [ShopController],
	providers: [ShopService, ShopRepo],
	exports: [ShopService, ShopRepo],
})
export class ShopModule {}
