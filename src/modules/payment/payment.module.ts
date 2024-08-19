import { ScheduleModule } from '@nestjs/schedule'
import { Module } from '@nestjs/common'
import { PaymentController } from './payment.controller'
import { PaymentService } from './payment.service'
import { PaymentRepo } from './payment.repo'

@Module({
	imports: [ScheduleModule.forRoot()],
	controllers: [PaymentController],
	providers: [PaymentService, PaymentRepo],
	exports: [PaymentService, PaymentRepo],
})
export class PaymentModule {}
