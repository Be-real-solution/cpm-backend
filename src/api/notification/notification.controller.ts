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
import { NotificationService } from "./notification.service";
import { CreateNotificationDto } from "./dto/create-notification.dto";
import { UpdateNotificationDto } from "./dto/update-notification.dto";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RolesDecorator } from "../auth/roles/RolesDecorator";
import { Roles } from "src/common/database/Enums";
import { JwtAuthGuard } from "../auth/user/AuthGuard";
import { RolesGuard } from "../auth/roles/RoleGuard";
import { AdminEntity, NotificationEntity, StoreEntity } from "src/core/entity";
import { CurrentLanguage } from "src/common/decorator/current-language";
import { FilterDto } from "src/common/dto/filter.dto";
import { CurrentUser } from "src/common/decorator/current-user";

@ApiTags("Notification")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller("notification")
export class NotificationController {
	constructor(private readonly notificationService: NotificationService) {}

	@ApiOperation({ summary: "create notification api for admins" })
	@ApiResponse({ status: 201, type: NotificationEntity, description: "return created data" })
	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
	@Post()
	public create(@Body() dto: CreateNotificationDto, @CurrentLanguage() lang: string) {
		return this.notificationService.create(dto, lang);
	}

	@ApiOperation({ summary: "find all notification api for admins" })
	@ApiResponse({ status: 200, type: [NotificationEntity], description: "return found data" })
	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN, Roles.STORE_ADMIN)
	@Get()
	public findAll(
		@CurrentLanguage() lang: string,
		@Query() query: FilterDto,
		@CurrentUser() user: StoreEntity | AdminEntity,
	) {
		return this.notificationService.findAllNotification(lang, query, user);
	}

	@ApiOperation({ summary: "find one notification api for admins and stores" })
	@ApiResponse({ status: 200, type: NotificationEntity, description: "return found data" })
	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN, Roles.STORE_ADMIN)
	@Get(":id")
	public findOne(
		@Param("id") id: string,
		@CurrentLanguage() lang: string,
		@CurrentUser() user: StoreEntity | AdminEntity,
	) {
		return this.notificationService.findOne(id, lang, user);
	}

	@ApiOperation({ summary: "update notification api for admins" })
	@ApiResponse({ status: 200, description: "return empty data" })
	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
	@Patch(":id")
	public update(
		@Param("id") id: string,
		@Body() dto: UpdateNotificationDto,
		@CurrentLanguage() lang: string,
	) {
		// return this.notificationService.update(id, dto);
	}

	@Delete(":id")
	remove(@Param("id") id: string) {
		return this.notificationService.remove(+id);
	}
}
