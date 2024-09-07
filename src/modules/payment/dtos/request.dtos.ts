import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { PaginationRequestDto } from '../../../common'
import { PaymentCreateRequest, PaymentGetAllRequest, PaymentGetOneByIdRequest } from '../interfaces'
import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator'
import { Type } from 'class-transformer'

export class PaymentGetAllRequestDto extends PaginationRequestDto implements PaymentGetAllRequest {
	@ApiPropertyOptional({ type: String })
	@IsUUID('4')
	@IsOptional()
	shopId?: string
}

export class PaymentGetOneByIdRequestDto implements PaymentGetOneByIdRequest {
	@ApiProperty({ type: String })
	@IsUUID('4')
	@IsNotEmpty()
	id: string
}

export class PaymentCreateRequestDto implements PaymentCreateRequest {
	@ApiProperty({ type: String })
	@IsUUID('4')
	@IsNotEmpty()
	shopId: string

	@ApiProperty({ type: Number })
	@IsNumber()
	@IsNotEmpty()
	sum: number
}

//=

export class PaymentMonthlyGetAllRequestDto extends PaginationRequestDto implements PaymentGetAllRequest {
	@ApiPropertyOptional({ type: Number })
	@IsNumber()
	@IsOptional()
	@Type(() => Number)
	forMonth?: number

	@ApiPropertyOptional({ type: Number })
	@IsNumber()
	@IsOptional()
	@Type(() => Number)
	forYear?: number

	@ApiPropertyOptional({ type: Number })
	@IsNumber()
	@IsOptional()
	@Type(() => Number)
	monthlyPay?: number

	@ApiPropertyOptional({ type: String })
	@IsUUID('4')
	@IsOptional()
	shopId?: string
}

export class PaymentMonthlyGetOneByIdRequestDto implements PaymentGetOneByIdRequest {
	@ApiProperty({ type: String })
	@IsUUID('4')
	@IsNotEmpty()
	id: string
}
