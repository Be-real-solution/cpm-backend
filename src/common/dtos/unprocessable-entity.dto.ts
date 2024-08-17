import { ApiProperty } from '@nestjs/swagger'

export class UnprocessableEntityExceptionDto {
	@ApiProperty({ example: 'message', type: String })
	message: string

	@ApiProperty({ example: {} })
	details: any
}
