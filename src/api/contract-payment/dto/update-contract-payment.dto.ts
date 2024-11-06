import { PartialType } from '@nestjs/swagger';
import { CreateContractPaymentDto } from './create-contract-payment.dto';

export class UpdateContractPaymentDto extends PartialType(CreateContractPaymentDto) {}
