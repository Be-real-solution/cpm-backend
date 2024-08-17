import { ApiProperty } from '@nestjs/swagger'
import { MutationResponse } from '../../interfaces'
import { newRandomUUID } from '../helpers'
import { IsNotEmpty, IsUUID } from 'class-validator'

export class MutationResponseDto implements MutationResponse {
	@ApiProperty({ type: String, example: newRandomUUID })
	@IsUUID('4')
	@IsNotEmpty()
	id: string
}
