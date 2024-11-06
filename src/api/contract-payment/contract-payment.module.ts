import { Module } from '@nestjs/common';
import { ContractPaymentService } from './contract-payment.service';
import { ContractPaymentController } from './contract-payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractPaymentEntity } from 'src/core/entity';
import { ContractModule } from '../contract/contract.module';

@Module({
  imports: [TypeOrmModule.forFeature([ContractPaymentEntity]), ContractModule],
  controllers: [ContractPaymentController],
  providers: [ContractPaymentService],
})
export class ContractPaymentModule {}
