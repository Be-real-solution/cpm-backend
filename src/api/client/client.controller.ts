import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Roles } from "src/common/database/Enums";
import { CurrentLanguage } from "src/common/decorator/current-language";
import { CurrentUser } from "src/common/decorator/current-user";
import { AdminEntity, ClientEntity, StoreEntity } from "src/core/entity";
import { RolesGuard } from "../auth/roles/RoleGuard";
import { RolesDecorator } from "../auth/roles/RolesDecorator";
import { JwtAuthGuard } from "../auth/user/AuthGuard";
import { ClientService } from "./client.service";
import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";
import { FilterDto } from "src/common/dto/filter.dto";
import { FindByClientDetailDto } from "./dto/find-by-client-details.dto";

@ApiTags("Clients")
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("client")
export class ClientController {
	constructor(private readonly clientService: ClientService) {}

	@ApiOperation({ summary: "create client api for store" })
	@ApiResponse({ status: 201, type: ClientEntity, description: "return created data" })
	@ApiBearerAuth()
	@RolesDecorator(Roles.STORE_ADMIN)
	@Post()
	public create(
		@Body() dto: CreateClientDto,
		@CurrentLanguage() lang: string,
		@CurrentUser() store: StoreEntity,
	) {
		return this.clientService.createClient({ ...dto }, lang, store);
	}

	@ApiOperation({ summary: "find all client api for store" })
	@ApiResponse({ status: 200, type: [ClientEntity], description: "return found data" })
	@ApiBearerAuth()
	@RolesDecorator(Roles.STORE_ADMIN)
	@Get()
	public findAll(
		@Query() query: FilterDto,
		@CurrentLanguage() lang: string,
		@CurrentUser() user: StoreEntity | AdminEntity,
	) {
		return this.clientService.findAllClient(query, lang, user);
	}

	@ApiOperation({ summary: "find one by client details api for store" })
	@ApiResponse({ status: 200, type: ClientEntity, description: "return found data" })
	@ApiBearerAuth()
	@RolesDecorator(Roles.STORE_ADMIN)
	@Get("find-client-detail")
	public findClientDetail(
		@Query() query: FindByClientDetailDto,
		@CurrentLanguage() lang: string,
	) {
		return this.clientService.findClientDetail(query, lang);
	}

	@ApiOperation({ summary: "find one client api for store" })
	@ApiResponse({ status: 200, type: ClientEntity, description: "return found data" })
	@ApiBearerAuth()
	@RolesDecorator(Roles.SUPER_ADMIN)
	@Get(":id")
	public findOne(
		@Param("id") id: string,
		@CurrentLanguage() lang: string,
		@CurrentUser() user: StoreEntity | AdminEntity,
	) {
		if (user.role == Roles.STORE_ADMIN) {
			return this.clientService.findOneById(id, lang, {
				where: { store: user, is_deleted: false },
			});
		}
		return this.clientService.findOneById(id, lang);
	}

	@ApiOperation({ summary: "update client api for store" })
	@ApiResponse({ status: 200, type: ClientEntity, description: "return empty data" })
	@ApiBearerAuth()
	@RolesDecorator(Roles.STORE_ADMIN)
	@Patch(":id")
	public update(
		@Param("id") id: string,
		@Body() dto: UpdateClientDto,
		@CurrentLanguage() lang: string,
		@CurrentUser() store: StoreEntity,
	) {
		return this.clientService.updateClient(id, dto, lang, store);
	}
}
