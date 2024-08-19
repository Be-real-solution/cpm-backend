import { Module } from '@nestjs/common'
import { ClientController } from './client.controller'
import { ClientService } from './client.service'
import { ClientRepo } from './client.repo'

@Module({
	imports: [],
	controllers: [ClientController],
	providers: [ClientService, ClientRepo],
	exports: [ClientService, ClientRepo],
})
export class ClientModule {}
