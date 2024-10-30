import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Roles } from "src/common/database/Enums";
import { CurrentLanguage } from "src/common/decorator/current-language";
import { CurrentUser } from "src/common/decorator/current-user";
import { AdminEntity, StorePaymentEntity } from "src/core/entity";
import { RolesGuard } from "../auth/roles/RoleGuard";
import { RolesDecorator } from "../auth/roles/RolesDecorator";
import { JwtAuthGuard } from "../auth/user/AuthGuard";
import { CreateStorePaymentDto } from "./dto/create-store-payment.dto";
import { StorePaymentService } from "./store-payment.service";

@ApiTags("Store Payments")
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("store-payment")
export class StorePaymentController {
	constructor(private readonly storePaymentService: StorePaymentService) {}

	@ApiOperation({ summary: "create store payment api for admins" })
	@ApiResponse({ status: 201, type: StorePaymentEntity, description: "return created data" })
	@ApiBearerAuth()
	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
	@Post()
	public create(
		@Body() dto: CreateStorePaymentDto,
		@CurrentLanguage() lang: string,
		@CurrentUser() admin: AdminEntity,
	) {
		return this.storePaymentService.createStorePayment(dto, lang, admin);
	}

	@ApiOperation({ summary: "find all store payment api for admins" })
	@ApiResponse({ status: 200, type: [StorePaymentEntity], description: "return found data" })
	@ApiBearerAuth()
	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
	@Get()
	public findAll(@CurrentLanguage() lang: string) {
		return this.storePaymentService.findAll(lang, { order: { created_at: "DESC" } });
	}

	@ApiOperation({ summary: "find by store id store payment api for admins" })
	@ApiResponse({ status: 200, type: [StorePaymentEntity], description: "return fouund data" })
	@ApiBearerAuth()
	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
	@Get("find-by-store/:id")
	public findByStoreId(@Param("id") id: string, @CurrentLanguage() lang: string) {
		return this.storePaymentService.findAll(lang, {
			where: { store: { id: id } },
			order: { created_at: "DESC" },
		});
	}

	// @Patch(":id")
	// update(@Param("id") id: string, @Body() updateStorePaymentDto: UpdateStorePaymentDto) {
	// 	return this.storePaymentService.update(+id, updateStorePaymentDto);
	// }

	// @Delete(":id")
	// remove(@Param("id") id: string) {
	// 	return this.storePaymentService.remove(+id);
	// }
}
