import { Injectable } from '@nestjs/common';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { BaseService } from 'src/infrastructure/lib/baseService';
import { ContractEntity, StoreEntity } from 'src/core/entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ContractRepository } from 'src/core/repository';

@Injectable()
export class ContractService extends BaseService<CreateContractDto, UpdateContractDto, ContractEntity> {
  constructor(@InjectRepository(ContractEntity) private readonly contractRepo: ContractRepository) {
    super(contractRepo, "Contract")
  }

  /** create contract for store */
  public async createContract(dto: CreateContractDto, lang: string, store: StoreEntity) {

  }

  findOne(id: number) {
    return `This action returns a #${id} contract`;
  }



  remove(id: number) {
    return `This action removes a #${id} contract`;
  }
}
