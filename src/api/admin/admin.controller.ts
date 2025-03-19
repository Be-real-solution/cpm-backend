import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Roles } from "src/common/database/Enums";
import { CurrentLanguage } from "src/common/decorator/current-language";
import { CurrentUser } from "src/common/decorator/current-user";
import { AdminEntity } from "src/core/entity";
import { RolesGuard } from "../auth/roles/RoleGuard";
import { RolesDecorator } from "../auth/roles/RolesDecorator";
import { JwtAuthGuard } from "../auth/user/AuthGuard";
import { AdminService } from "./admin.service";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { UpdateAdminDto } from "./dto/update-admin.dto";

@ApiTags("Admin")
@Controller("admin")
export class AdminController {
	constructor(private readonly adminService: AdminService) {}

	@ApiOperation({ summary: "create admin api for test" })
	@ApiResponse({ status: 201, type: AdminEntity, description: "admin create data" })
	@Post("/create-super-admin")
	public createSuperAdmin(@Body() dto: CreateAdminDto, @CurrentLanguage() lang: string) {
		return this.adminService.createAdmin(dto, lang);
	}

	@ApiOperation({ summary: "create admin api for super admin" })
	@ApiResponse({ status: 201, type: AdminEntity, description: "admin create data" })
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.SUPER_ADMIN)
	@Post("/create")
	public create(@Body() dto: CreateAdminDto, @CurrentLanguage() lang: string) {
		return this.adminService.createAdmin(dto, lang);
	}

	@ApiOperation({ summary: "find all admin api for super admin" })
	@ApiResponse({ status: 200, type: [AdminEntity], description: "return found data" })
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.SUPER_ADMIN)
	@Get()
	public findAll(@CurrentLanguage() lang: string) {
		return this.adminService.findAll(lang, {
			order: { id: "DESC" },
			where: { is_deleted: false },
		});
	}

	@ApiOperation({ summary: "find self info for admin" })
	@ApiResponse({ status: 200, type: AdminEntity, description: "return found data" })
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
	@Get("get-self-info")
	public findSelfInfo(@CurrentLanguage() lang: string, @CurrentUser() admin: AdminEntity) {
		return this.adminService.findOneById(admin.id, lang, { where: { is_deleted: false } });
	}

	@ApiOperation({ summary: "find one admin api for super admin" })
	@ApiResponse({ status: 200, type: AdminEntity, description: "return found data" })
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.SUPER_ADMIN)
	@Get(":id")
	public findOne(@Param("id") id: string, @CurrentLanguage() lang: string) {
		return this.adminService.findOneById(id, lang);
	}

	@ApiOperation({ summary: "update admin api for super admin" })
	@ApiResponse({ status: 200, description: "return updated data" })
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN)
	@Patch(":id")
	public update(
		@Param("id") id: string,
		@Body() dto: UpdateAdminDto,
		@CurrentLanguage() lang: string,
		@CurrentUser() user: AdminEntity,
	) {
		return this.adminService.updateAdmin(id, dto, lang, user);
	}

	@ApiOperation({ summary: "remove admin api for super admin" })
	@ApiResponse({ status: 200, description: "return success message" })
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@RolesDecorator(Roles.SUPER_ADMIN)
	@Delete(":id")
	public remove(@Param("id") id: string, @CurrentLanguage() lang: string) {
		return this.adminService.delete(id, lang);
	}
}
