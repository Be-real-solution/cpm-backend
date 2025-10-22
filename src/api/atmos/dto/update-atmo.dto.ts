import { PartialType } from '@nestjs/swagger';
import { CreateAtmoDto } from './create-atmo.dto';

export class UpdateAtmoDto extends PartialType(CreateAtmoDto) {}
