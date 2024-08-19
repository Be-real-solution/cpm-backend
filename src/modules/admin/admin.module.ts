import { Module } from '@nestjs/common'
import { AdminController } from './admin.controller'
import { AdminService } from './admin.service'
import { AdminRepo } from './admin.repo'

@Module({
	imports: [],
	controllers: [AdminController],
	providers: [AdminService, AdminRepo],
	exports: [AdminService, AdminRepo],
})
export class AdminModule {}
