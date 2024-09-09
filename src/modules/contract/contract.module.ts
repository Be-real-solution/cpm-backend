import { Module } from '@nestjs/common'
import { ContractController } from './contact.controller'
import { ContractService } from './contract.service'
import { ContractRepo } from './contract.repo'

@Module({
	imports: [],
	controllers: [ContractController],
	providers: [ContractService, ContractRepo],
	exports: [ContractService, ContractRepo],
})
export class ContractModule {}
