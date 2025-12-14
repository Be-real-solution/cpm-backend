import { Module } from '@nestjs/common';
import { ContractPaymentService } from './contract-payment.service';
import { ContractPaymentController } from './contract-payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractPaymentEntity } from 'src/core/entity';
import { ContractModule } from '../contract/contract.module';
import { PaymentModule } from '../payment/payment.module';
import { PaymentEntity } from 'src/core/entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContractPaymentEntity, PaymentEntity]), ContractModule, PaymentModule],
  controllers: [ContractPaymentController],
  providers: [ContractPaymentService],
})
export class ContractPaymentModule {}
