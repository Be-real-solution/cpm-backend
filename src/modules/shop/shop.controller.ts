import { ShopGetAllResponseDto, ShopGetOneResponseDto } from './dtos/response.dtos'
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { ShopService } from './shop.service'
import { ApiBearerAuth, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AuthGuard, MutationResponseDto, PAGE_NUMBER, PAGE_SIZE, PAGINATION } from '../../common'
import { ShopCreateRequestDto, ShopDeleteRequestDto, ShopGetAllRequestDto, ShopGetOneByIdRequestDto, ShopUpdateRequestDto } from './dtos'
import { ShopGetAllResponse, ShopGetOneResponse } from './interfaces'
import { MutationResponse } from '../../interfaces'
import { FileInterceptor } from '@nestjs/platform-express'

@ApiTags('shop')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('shop')
export class ShopController {
	private readonly service: ShopService
	constructor(service: ShopService) {
		this.service = service
	}

	@Get()
	@ApiResponse({ type: ShopGetAllResponseDto })
	@ApiResponse({ type: ShopGetOneResponseDto, isArray: true })
	getAll(@Query() payload: ShopGetAllRequestDto): Promise<ShopGetAllResponse | ShopGetOneResponse[]> {
		return this.service.getAll({
			...payload,
			pageNumber: payload.pageNumber ?? PAGE_NUMBER,
			pageSize: payload.pageSize ?? PAGE_SIZE,
			pagination: [true, 'true'].includes(payload.pagination) ? PAGINATION : false,
		})
	}

	@Get(':id')
	@ApiResponse({ type: ShopGetOneResponseDto })
	getOneById(@Param() payload: ShopGetOneByIdRequestDto): Promise<ShopGetOneResponse> {
		return this.service.getOneById(payload)
	}

	@Post()
	@ApiConsumes('multipart/form-data')
	@UseInterceptors(FileInterceptor('file'))
	@ApiResponse({ type: MutationResponseDto })
	create(@Body() payload: ShopCreateRequestDto, @UploadedFile() file: Express.Multer.File): Promise<MutationResponse> {
		return this.service.create({ ...payload, contractFile: file.filename })
	}

	@Patch(':id')
	@ApiConsumes('multipart/form-data')
	@UseInterceptors(FileInterceptor('file'))
	@ApiResponse({ type: MutationResponseDto })
	update(@Param() param: ShopGetOneByIdRequestDto, @Body() payload: ShopUpdateRequestDto, @UploadedFile() file: Express.Multer.File): Promise<MutationResponse> {
		return this.service.update(param, { ...payload, contractFile: file?.filename ? file?.filename : undefined })
	}

	@Delete(':id')
	@ApiResponse({ type: MutationResponseDto })
	delete(@Param() param: ShopDeleteRequestDto): Promise<MutationResponse> {
		return this.service.delete(param)
	}
}
