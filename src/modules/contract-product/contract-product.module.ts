import { Module } from '@nestjs/common'
import { ContractProductController } from './contact-product.controller'
import { ContractProductService } from './contract-product.service'
import { ContractProductRepo } from './contract-product.repo'

@Module({
	imports: [],
	controllers: [ContractProductController],
	providers: [ContractProductService, ContractProductRepo],
	exports: [ContractProductService, ContractProductRepo],
})
export class ContractProductModule {}
