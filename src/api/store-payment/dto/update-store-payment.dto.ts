import { PartialType } from '@nestjs/swagger';
import { CreateStorePaymentDto } from './create-store-payment.dto';

export class UpdateStorePaymentDto extends PartialType(CreateStorePaymentDto) {}
