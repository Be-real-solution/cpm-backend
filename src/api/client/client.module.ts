import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientEntity } from 'src/core/entity';
import { StoreClientModule } from '../store-client/store-client.module';

@Module({
  imports: [TypeOrmModule.forFeature([ClientEntity]), StoreClientModule],
  controllers: [ClientController],
  providers: [ClientService],
})
export class ClientModule {}
