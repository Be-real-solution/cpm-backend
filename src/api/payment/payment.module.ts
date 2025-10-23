import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { AtmosEntity } from 'src/core/entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientModule } from '../client/client.module';

@Module({
  imports: [TypeOrmModule.forFeature([AtmosEntity]), ClientModule],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
