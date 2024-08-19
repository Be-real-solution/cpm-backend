import { PaymentGetAllResponseDto, PaymentGetOneResponseDto, PaymentMonthlyGetAllResponseDto, PaymentMonthlyGetOneResponseDto } from './dtos/response.dtos'
import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common'
import { PaymentService } from './payment.service'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AuthGuard, MutationResponseDto, PAGE_NUMBER, PAGE_SIZE, PAGINATION } from '../../common'
import { PaymentCreateRequestDto, PaymentGetAllRequestDto, PaymentGetOneByIdRequestDto, PaymentMonthlyGetAllRequestDto, PaymentMonthlyGetOneByIdRequestDto } from './dtos'
import { PaymentGetAllResponse, PaymentGetOneResponse, PaymentMonthlyGetAllResponse, PaymentMonthlyGetOneResponse } from './interfaces'
import { MutationResponse } from '../../interfaces'

@ApiTags('payment')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('payment')
export class PaymentController {
	private readonly service: PaymentService
	constructor(service: PaymentService) {
		this.service = service
	}

	@Get()
	@ApiResponse({ type: PaymentGetAllResponseDto })
	@ApiResponse({ type: PaymentGetOneResponseDto, isArray: true })
	getAll(@Query() payload: PaymentGetAllRequestDto): Promise<PaymentGetAllResponse | PaymentGetOneResponse[]> {
		return this.service.getAll({
			...payload,
			pageNumber: payload.pageNumber ?? PAGE_NUMBER,
			pageSize: payload.pageSize ?? PAGE_SIZE,
			pagination: [true, 'true'].includes(payload.pagination) ? PAGINATION : false,
		})
	}

	@Get('monthly')
	@ApiResponse({ type: PaymentMonthlyGetAllResponseDto })
	@ApiResponse({ type: PaymentMonthlyGetOneResponseDto, isArray: true })
	getAllMonthly(@Query() payload: PaymentMonthlyGetAllRequestDto): Promise<PaymentMonthlyGetAllResponse | PaymentMonthlyGetOneResponse[]> {
		return this.service.getAllMonthly({
			...payload,
			pageNumber: payload.pageNumber ?? PAGE_NUMBER,
			pageSize: payload.pageSize ?? PAGE_SIZE,
			pagination: [true, 'true'].includes(payload.pagination) ? PAGINATION : false,
		})
	}

	@Get('monthly/:id')
	@ApiResponse({ type: PaymentMonthlyGetOneResponseDto })
	getOneMonthlyById(@Param() payload: PaymentMonthlyGetOneByIdRequestDto): Promise<PaymentMonthlyGetOneResponse> {
		return this.service.getOneMonthlyById(payload)
	}

	@Get(':id')
	@ApiResponse({ type: PaymentGetOneResponseDto })
	getOneById(@Param() payload: PaymentGetOneByIdRequestDto): Promise<PaymentGetOneResponse> {
		return this.service.getOneById(payload)
	}

	@Post()
	@ApiResponse({ type: MutationResponseDto })
	create(@Body() payload: PaymentCreateRequestDto): Promise<MutationResponse> {
		return this.service.create(payload)
	}
}
