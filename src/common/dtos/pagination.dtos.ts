import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { PaginationRequest } from '../../interfaces'
import { IsBooleanString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator'

export class PaginationRequestDto implements PaginationRequest {
	@ApiPropertyOptional({ type: Number })
	@IsNumber()
	@IsOptional()
	pageNumber?: number

	@ApiPropertyOptional({ type: Number })
	@IsNumber()
	@IsOptional()
	pageSize?: number

	@ApiPropertyOptional({ type: Boolean, example: false })
	@IsBooleanString()
	@IsOptional()
	pagination?: boolean
}

export class PaginationResponseDto {
	@ApiProperty({ example: 20 })
	@IsNumber()
	@IsNotEmpty()
	pagesCount: number

	@ApiProperty({ example: 10 })
	@IsNumber()
	@IsNotEmpty()
	pageSize: number
}
