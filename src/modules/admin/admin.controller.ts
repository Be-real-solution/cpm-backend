import { AdminGetAllResponseDto, AdminGetOneResponseDto } from './dtos/response.dtos'
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { AdminService } from './admin.service'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AuthGuard, MutationResponseDto, PAGE_NUMBER, PAGE_SIZE, PAGINATION } from '../../common'
import { AdminCreateRequestDto, AdminDeleteRequestDto, AdminGetAllRequestDto, AdminGetOneByIdRequestDto, AdminUpdateRequestDto } from './dtos'
import { AdminGetAllResponse, AdminGetOneResponse } from './interfaces'
import { MutationResponse } from '../../interfaces'

@ApiTags('admin')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('admin')
export class AdminController {
	private readonly service: AdminService
	constructor(service: AdminService) {
		this.service = service
	}

	@Get()
	@ApiResponse({ type: AdminGetAllResponseDto })
	@ApiResponse({ type: AdminGetOneResponseDto, isArray: true })
	getAll(@Query() payload: AdminGetAllRequestDto): Promise<AdminGetAllResponse | AdminGetOneResponse[]> {
		return this.service.getAll({
			...payload,
			pageNumber: payload.pageNumber ?? PAGE_NUMBER,
			pageSize: payload.pageSize ?? PAGE_SIZE,
			pagination: [true, 'true'].includes(payload.pagination) ? PAGINATION : false,
		})
	}

	@Get(':id')
	@ApiResponse({ type: AdminGetOneResponseDto })
	getOneById(@Param() payload: AdminGetOneByIdRequestDto): Promise<AdminGetOneResponse> {
		return this.service.getOneById(payload)
	}

	@Post()
	@ApiResponse({ type: MutationResponseDto })
	create(@Body() payload: AdminCreateRequestDto): Promise<MutationResponse> {
		return this.service.create(payload)
	}

	@Patch(':id')
	@ApiResponse({ type: MutationResponseDto })
	update(@Param() param: AdminGetOneByIdRequestDto, @Body() payload: AdminUpdateRequestDto): Promise<MutationResponse> {
		return this.service.update(param, payload)
	}

	@Delete(':id')
	@ApiResponse({ type: MutationResponseDto })
	delete(@Param() param: AdminDeleteRequestDto): Promise<MutationResponse> {
		return this.service.delete(param)
	}
}
