import { NotificationGetAllResponseDto, NotificationGetOneResponseDto } from './dtos/response.dtos'
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { NotificationService } from './notification.service'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AuthGuard, MutationResponseDto, PAGE_NUMBER, PAGE_SIZE, PAGINATION } from '../../common'
import { NotificationCreateRequestDto, NotificationDeleteRequestDto, NotificationGetAllRequestDto, NotificationGetOneByIdRequestDto, NotificationUpdateRequestDto } from './dtos'
import { NotificationGetAllResponse, NotificationGetOneResponse } from './interfaces'
import { MutationResponse } from '../../interfaces'

@ApiTags('notification')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('notification')
export class NotificationController {
	private readonly service: NotificationService
	constructor(service: NotificationService) {
		this.service = service
	}

	@Get()
	@ApiResponse({ type: NotificationGetAllResponseDto })
	@ApiResponse({ type: NotificationGetOneResponseDto, isArray: true })
	getAll(@Query() payload: NotificationGetAllRequestDto): Promise<NotificationGetAllResponse | NotificationGetOneResponse[]> {
		return this.service.getAll({
			...payload,
			pageNumber: payload.pageNumber ?? PAGE_NUMBER,
			pageSize: payload.pageSize ?? PAGE_SIZE,
			pagination: [true, 'true'].includes(payload.pagination) ? PAGINATION : false,
		})
	}

	@Get(':id')
	@ApiResponse({ type: NotificationGetOneResponseDto })
	getOneById(@Param() payload: NotificationGetOneByIdRequestDto): Promise<NotificationGetOneResponse> {
		return this.service.getOneById(payload)
	}

	@Post()
	@ApiResponse({ type: MutationResponseDto })
	create(@Body() payload: NotificationCreateRequestDto): Promise<MutationResponse> {
		return this.service.create(payload)
	}

	@Patch(':id')
	@ApiResponse({ type: MutationResponseDto })
	update(@Param() param: NotificationGetOneByIdRequestDto, @Body() payload: NotificationUpdateRequestDto): Promise<MutationResponse> {
		return this.service.update(param, payload)
	}

	@Delete(':id')
	@ApiResponse({ type: MutationResponseDto })
	delete(@Param() param: NotificationDeleteRequestDto): Promise<MutationResponse> {
		return this.service.delete(param)
	}
}
