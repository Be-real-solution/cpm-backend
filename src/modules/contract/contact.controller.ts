import { ContractGetAllResponseDto, ContractGetOneResponseDto } from './dtos/response.dtos'
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { ContractService } from './contract.service'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AuthGuard, MutationResponseDto, PAGE_NUMBER, PAGE_SIZE, PAGINATION } from '../../common'
import { ContractCreateRequestDto, ContractDeleteRequestDto, ContractGetAllRequestDto, ContractGetOneByIdRequestDto, ContractUpdateRequestDto } from './dtos'
import { ContractGetAllResponse, ContractGetOneResponse } from './interfaces'
import { MutationResponse } from '../../interfaces'

@ApiTags('contract')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('contract')
export class ContractController {
	private readonly service: ContractService
	constructor(service: ContractService) {
		this.service = service
	}

	@Get()
	@ApiResponse({ type: ContractGetAllResponseDto })
	@ApiResponse({ type: ContractGetOneResponseDto, isArray: true })
	getAll(@Query() payload: ContractGetAllRequestDto): Promise<ContractGetAllResponse | ContractGetOneResponse[]> {
		return this.service.getAll({
			...payload,
			pageNumber: payload.pageNumber ?? PAGE_NUMBER,
			pageSize: payload.pageSize ?? PAGE_SIZE,
			pagination: [true, 'true'].includes(payload.pagination) ? PAGINATION : false,
		})
	}

	@Get(':id')
	@ApiResponse({ type: ContractGetOneResponseDto })
	getOneById(@Param() payload: ContractGetOneByIdRequestDto): Promise<ContractGetOneResponse> {
		return this.service.getOneById(payload)
	}

	@Post()
	@ApiResponse({ type: MutationResponseDto })
	create(@Body() payload: ContractCreateRequestDto): Promise<MutationResponse> {
		return this.service.create({ ...payload })
	}

	@Patch(':id')
	@ApiResponse({ type: MutationResponseDto })
	update(@Param() param: ContractGetOneByIdRequestDto, @Body() payload: ContractUpdateRequestDto): Promise<MutationResponse> {
		return this.service.update(param, { ...payload })
	}

	@Delete(':id')
	@ApiResponse({ type: MutationResponseDto })
	delete(@Param() param: ContractDeleteRequestDto): Promise<MutationResponse> {
		return this.service.delete(param)
	}
}
