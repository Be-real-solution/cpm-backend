import { PartialType } from '@nestjs/swagger';
import { CreateStoreClientDto } from './create-store-client.dto';

export class UpdateStoreClientDto extends PartialType(CreateStoreClientDto) {}
