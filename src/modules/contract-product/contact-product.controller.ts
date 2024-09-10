import { ContractProductGetAllResponseDto, ContractProductGetOneResponseDto } from './dtos/response.dtos'
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { ContractProductService } from './contract-product.service'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AuthGuard, MutationResponseDto, PAGE_NUMBER, PAGE_SIZE, PAGINATION } from '../../common'
import {
	ContractProductCreateRequestDto,
	ContractProductDeleteRequestDto,
	ContractProductGetAllRequestDto,
	ContractProductGetOneByIdRequestDto,
	ContractProductUpdateRequestDto,
} from './dtos'
import { ContractProductGetAllResponse, ContractProductGetOneResponse } from './interfaces'
import { MutationResponse } from '../../interfaces'

@ApiTags('contract-product')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('contract-product')
export class ContractProductController {
	private readonly service: ContractProductService
	constructor(service: ContractProductService) {
		this.service = service
	}

	@Get()
	@ApiResponse({ type: ContractProductGetAllResponseDto })
	@ApiResponse({ type: ContractProductGetOneResponseDto, isArray: true })
	getAll(@Query() payload: ContractProductGetAllRequestDto): Promise<ContractProductGetAllResponse | ContractProductGetOneResponse[]> {
		return this.service.getAll({
			...payload,
			pageNumber: payload.pageNumber ?? PAGE_NUMBER,
			pageSize: payload.pageSize ?? PAGE_SIZE,
			pagination: [true, 'true'].includes(payload.pagination) ? PAGINATION : false,
		})
	}

	@Get(':id')
	@ApiResponse({ type: ContractProductGetOneResponseDto })
	getOneById(@Param() payload: ContractProductGetOneByIdRequestDto): Promise<ContractProductGetOneResponse> {
		return this.service.getOneById(payload)
	}

	@Post()
	@ApiResponse({ type: MutationResponseDto })
	create(@Body() payload: ContractProductCreateRequestDto): Promise<MutationResponse> {
		return this.service.create({ ...payload })
	}

	@Patch(':id')
	@ApiResponse({ type: MutationResponseDto })
	update(@Param() param: ContractProductGetOneByIdRequestDto, @Body() payload: ContractProductUpdateRequestDto): Promise<MutationResponse> {
		return this.service.update(param, { ...payload })
	}

	@Delete(':id')
	@ApiResponse({ type: MutationResponseDto })
	delete(@Param() param: ContractProductDeleteRequestDto): Promise<MutationResponse> {
		return this.service.delete(param)
	}
}
