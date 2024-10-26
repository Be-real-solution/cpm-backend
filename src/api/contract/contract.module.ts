import { Module } from '@nestjs/common';
import { ContractService } from './contract.service';
import { ContractController } from './contract.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractEntity } from 'src/core/entity';
import { ClientModule } from '../client/client.module';

@Module({
  imports: [TypeOrmModule.forFeature([ContractEntity]), ClientModule],
  controllers: [ContractController],
  providers: [ContractService],
})
export class ContractModule {}
