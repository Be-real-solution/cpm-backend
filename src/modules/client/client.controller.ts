import { ClientGetAllResponseDto, ClientGetOneResponseDto } from './dtos/response.dtos'
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { ClientService } from './client.service'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AuthGuard, MutationResponseDto, PAGE_NUMBER, PAGE_SIZE, PAGINATION } from '../../common'
import { ClientCreateRequestDto, ClientDeleteRequestDto, ClientGetAllRequestDto, ClientGetOneByIdRequestDto, ClientUpdateRequestDto } from './dtos'
import { ClientGetAllResponse, ClientGetOneResponse } from './interfaces'
import { MutationResponse } from '../../interfaces'

@ApiTags('client')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('client')
export class ClientController {
	private readonly service: ClientService
	constructor(service: ClientService) {
		this.service = service
	}

	@Get()
	@ApiResponse({ type: ClientGetAllResponseDto })
	@ApiResponse({ type: ClientGetOneResponseDto, isArray: true })
	getAll(@Query() payload: ClientGetAllRequestDto): Promise<ClientGetAllResponse | ClientGetOneResponse[]> {
		return this.service.getAll({
			...payload,
			pageNumber: payload.pageNumber ?? PAGE_NUMBER,
			pageSize: payload.pageSize ?? PAGE_SIZE,
			pagination: [true, 'true'].includes(payload.pagination) ? PAGINATION : false,
		})
	}

	@Get(':id')
	@ApiResponse({ type: ClientGetOneResponseDto })
	getOneById(@Param() payload: ClientGetOneByIdRequestDto): Promise<ClientGetOneResponse> {
		return this.service.getOneById(payload)
	}

	@Post()
	@ApiResponse({ type: MutationResponseDto })
	create(@Body() payload: ClientCreateRequestDto): Promise<MutationResponse> {
		return this.service.create({ ...payload, birthday: new Date(payload.birthday) })
	}

	@Patch(':id')
	@ApiResponse({ type: MutationResponseDto })
	update(@Param() param: ClientGetOneByIdRequestDto, @Body() payload: ClientUpdateRequestDto): Promise<MutationResponse> {
		return this.service.update(param, payload)
	}

	@Delete(':id')
	@ApiResponse({ type: MutationResponseDto })
	delete(@Param() param: ClientDeleteRequestDto): Promise<MutationResponse> {
		return this.service.delete(param)
	}
}
