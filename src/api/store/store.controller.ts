import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
	UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Roles } from "src/common/database/Enums";
import { CurrentLanguage } from "src/common/decorator/current-language";
import { CurrentUser } from "src/common/decorator/current-user";
import { AdminEntity, StoreEntity } from "src/core/entity";
import { RolesGuard } from "../auth/roles/RoleGuard";
import { RolesDecorator } from "../auth/roles/RolesDecorator";
import { JwtAuthGuard } from "../auth/user/AuthGuard";
import { BlockingOrUnblockingDto, CreateStoreDto, UpdateStoreDto } from "./dto";
import { StoreFilterDto } from "./dto/store-filter.dto";
import { StoreService } from "./store.service";
import { CreateStoreContractPDFDto } from "./dto/create-store-contract-pdf.dto";

@ApiTags("Store")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller("store")
export class StoreController {
	constructor(private readonly storeService: StoreService) {}

	@ApiOperation({ summary: "create store api for admins" })
	@ApiResponse({ status: 201, type: StoreEntity, description: "return created data" })
	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
	@Post()
	public create(
		@Body() dto: CreateStoreDto,
		@CurrentLanguage() lang: string,
		@CurrentUser() admin: AdminEntity,
	) {
		return this.storeService.createStore(dto, lang, admin);
	}

	@ApiOperation({ summary: "create store contract pdf api for admins" })
	@ApiResponse({ status: 200, type: StoreEntity, description: "return store data" })
	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
	@Post("/create-contract-pdf")
	public createStoreContractPdf(
		@Body() dto: CreateStoreContractPDFDto,
		@CurrentLanguage() lang: string,
	) {
		return this.storeService.createStoreContractPdf(dto, lang);
	}

	@ApiOperation({ summary: "find all stores api for admins" })
	@ApiResponse({ status: 200, type: [StoreEntity], description: "return found data" })
	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
	@Get()
	public findAll(@CurrentLanguage() lang: string, @Query() query: StoreFilterDto) {
		return this.storeService.findAllStore(query, lang);
	}

	@ApiOperation({ summary: "find all stores api for admins" })
	@ApiResponse({ status: 200, type: [StoreEntity], description: "return found data" })
	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
	@Get('report-store')
	public reportStore(@Query() query: StoreFilterDto, @CurrentLanguage() lang: string) {
		return this.storeService.reportStore(query, lang);
	}

	@ApiOperation({ summary: "find self info api for stores" })
	@ApiResponse({ status: 200, type: StoreEntity, description: "return found data" })
	@RolesDecorator(Roles.STORE_ADMIN)
	@Get("find-self-info")
	public findSelfInfo(@CurrentLanguage() lang: string, @CurrentUser() store: StoreEntity) {
		return this.storeService.findOneById(store.id, lang, {
			where: { is_active: true, is_deleted: false },
			relations: { payments: true },
		});
	}

	@ApiOperation({ summary: "find one stores api for admins" })
	@ApiResponse({ status: 200, type: StoreEntity, description: "return found data" })
	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
	@Get(":id")
	public findOne(@Param("id") id: string, @CurrentLanguage() lang: string) {
		return this.storeService.findOneById(id, lang, { where: { is_deleted: false } });
	}

	@ApiOperation({ summary: "blocking or unblocking store api for admins" })
	@ApiResponse({ status: 200, description: "return success message and empty data" })
	@ApiQuery({
		name: "is_active",
		required: true,
		example: true,
		description: "true or false value required",
	})
	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
	@Patch("blocking-or-unblocking/:id")
	public blockingOrUnblocking(
		@Param("id") id: string,
		@Query() dto: BlockingOrUnblockingDto,
		@CurrentLanguage() lang: string,
	) {
		return this.storeService.blockingOrUnblocking(id, dto.is_active, lang);
	}

	@ApiOperation({ summary: "update store api for store and admins" })
	@ApiResponse({ status: 200, type: StoreEntity, description: "return updated data" })
	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN, Roles.STORE_ADMIN)
	@Patch(":id")
	public update(
		@Param("id") id: string,
		@Body() dto: UpdateStoreDto,
		@CurrentLanguage() lang: string,
		@CurrentUser() user: StoreEntity | AdminEntity,
	) {
		return this.storeService.updateStore(id, dto, lang, user);
	}

	@ApiOperation({ summary: "delete store api for admins" })
	@ApiResponse({
		status: 200,
		description: "return success message and empty data",
	})
	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
	@Delete(":id")
	public remove(@Param("id") id: string, @CurrentLanguage() lang: string) {
		return this.storeService.delete(id, lang);
	}
}
