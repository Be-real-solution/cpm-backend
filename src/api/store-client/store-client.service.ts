import { Injectable } from '@nestjs/common';
import { CreateStoreClientDto } from './dto/create-store-client.dto';
import { UpdateStoreClientDto } from './dto/update-store-client.dto';
import { BaseService } from 'src/infrastructure/lib/baseService';
import { StoreClientEntity } from 'src/core/entity';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreClientRepository } from 'src/core/repository';

@Injectable()
export class StoreClientService extends BaseService<CreateStoreClientDto, UpdateStoreClientDto, StoreClientEntity> {
  constructor(@InjectRepository(StoreClientEntity) private readonly storeClientRepo: StoreClientRepository) {
    super(storeClientRepo, "Store client")
  }

}
