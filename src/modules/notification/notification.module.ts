import { Module } from '@nestjs/common'
import { NotificationController } from './notification.controller'
import { NotificationService } from './notification.service'
import { NotificationRepo } from './notification.repo'

@Module({
	imports: [],
	controllers: [NotificationController],
	providers: [NotificationService, NotificationRepo],
	exports: [NotificationService, NotificationRepo],
})
export class NotificationModule {}
