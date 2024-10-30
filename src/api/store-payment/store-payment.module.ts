import { Module } from '@nestjs/common';
import { StorePaymentService } from './store-payment.service';
import { StorePaymentController } from './store-payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorePaymentEntity } from 'src/core/entity';
import { StoreModule } from '../store/store.module';

@Module({
  imports: [TypeOrmModule.forFeature([StorePaymentEntity]), StoreModule],
  controllers: [StorePaymentController],
  providers: [StorePaymentService],
})
export class StorePaymentModule {}
