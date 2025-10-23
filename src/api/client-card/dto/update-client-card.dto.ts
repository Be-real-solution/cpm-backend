import { PartialType } from '@nestjs/swagger';
import { CreateClientCardDto } from './create-client-card.dto';

export class UpdateClientCardDto extends PartialType(CreateClientCardDto) {}
