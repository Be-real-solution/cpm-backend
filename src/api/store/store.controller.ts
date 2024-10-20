import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
	Query,
} from "@nestjs/common";
import { StoreService } from "./store.service";
import { BlockingOrUnblockingDto, CreateStoreDto, UpdateStoreDto } from "./dto";
import {
	ApiBearerAuth,
	ApiBody,
	ApiOperation,
	ApiQuery,
	ApiResponse,
	ApiTags,
} from "@nestjs/swagger";
import { AdminEntity, StoreEntity } from "src/core/entity";
import { CurrentLanguage } from "src/common/decorator/current-language";
import { JwtAuthGuard } from "../auth/user/AuthGuard";
import { RolesGuard } from "../auth/roles/RoleGuard";
import { RolesDecorator } from "../auth/roles/RolesDecorator";
import { Roles } from "src/common/database/Enums";
import { CurrentUser } from "src/common/decorator/current-user";

@ApiTags("Store")
@UseGuards(JwtAuthGuard, RolesGuard)
@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
@Controller("store")
export class StoreController {
	constructor(private readonly storeService: StoreService) {}

	@ApiOperation({ summary: "create store api for admins" })
	@ApiResponse({ status: 201, type: StoreEntity, description: "return created data" })
	@ApiBearerAuth()
	@Post()
	public create(
		@Body() dto: CreateStoreDto,
		@CurrentLanguage() lang: string,
		@CurrentUser() admin: AdminEntity,
	) {
		return this.storeService.createStore(dto, lang, admin);
	}

	@ApiOperation({ summary: "find all stores api for admins" })
	@ApiResponse({ status: 200, type: [StoreEntity], description: "return found data" })
	@ApiBearerAuth()
	@Get()
	public findAll(@CurrentLanguage() lang: string) {
		return this.storeService.findAll(lang, {
			where: { is_deleted: false },
			order: { order: "DESC" },
		});
	}

	@ApiOperation({ summary: "find one stores api for admins" })
	@ApiResponse({ status: 200, type: StoreEntity, description: "return found data" })
	@ApiBearerAuth()
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
	@ApiBearerAuth()
	@Patch("blocking-or-unblocking/:id")
	public blockingOrUnblocking(
		@Param("id") id: string,
		@Query() dto: BlockingOrUnblockingDto,
		@CurrentLanguage() lang: string,
	) {
		return this.storeService.blockingOrUnblocking(id, dto.is_active, lang);
	}

	@ApiOperation({ summary: "update store api for admins" })
	@ApiResponse({ status: 200, type: StoreEntity, description: "return updated data" })
	@ApiBearerAuth()
	@Patch(":id")
	public update(
		@Param("id") id: string,
		@Body() dto: UpdateStoreDto,
		@CurrentLanguage() lang: string,
	) {
		return this.storeService.update(id, dto, lang);
	}

	@ApiOperation({ summary: "delete store api for admins" })
	@ApiResponse({
		status: 200,
		description: "return success message and empty data",
	})
	@ApiBearerAuth()
	@Delete(":id")
	public remove(@Param("id") id: string, @CurrentLanguage() lang: string) {
		return this.storeService.delete(id, lang);
	}
}
