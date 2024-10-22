import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/database/Enums';
import { CurrentLanguage } from 'src/common/decorator/current-language';
import { CurrentUser } from 'src/common/decorator/current-user';
import { ClientEntity, StoreEntity } from 'src/core/entity';
import { RolesGuard } from '../auth/roles/RoleGuard';
import { RolesDecorator } from '../auth/roles/RolesDecorator';
import { JwtAuthGuard } from '../auth/user/AuthGuard';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

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

	@ApiOperation({ summary: "find all client api for store and admin" })
	@ApiResponse({ status: 200, type: [ClientEntity], description: "return found data" })
	@ApiBearerAuth()
	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN, Roles.STORE_ADMIN)
	@Get()
	public findAll(@CurrentLanguage() lang: string) {
		return this.clientService.findAll(lang, {order: {created_at: "DESC"}});
	}

	@ApiOperation({ summary: "find one client api for store and admin" })
	@ApiResponse({ status: 200, type: ClientEntity, description: "return found data" })
	@ApiBearerAuth()
	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN, Roles.STORE_ADMIN)
	@Get(":id")
	public findOne(@Param("id") id: string, @CurrentLanguage() lang: string) {
		return this.clientService.findOneById(id, lang);
	}

	@ApiOperation({ summary: "update client api for store and admin. Not complated" })
	@ApiResponse({ status: 200, type: ClientEntity, description: "return updated data" })
	@ApiBearerAuth()
	@RolesDecorator(Roles.SUPER_ADMIN, Roles.ADMIN, Roles.STORE_ADMIN)
	@Patch(":id")
	public update(@Param("id") id: string, @Body() dto: UpdateClientDto) {
		// return this.clientService.update(+id, updateClientDto);
	}
}
