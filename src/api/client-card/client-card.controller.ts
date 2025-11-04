import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from "@nestjs/common";
import { ClientCardService } from "./client-card.service";
import { CreateClientCardDto } from "./dto/create-client-card.dto";
import { UpdateClientCardDto } from "./dto/update-client-card.dto";
import { CurrentLanguage } from "src/common/decorator/current-language";
import { RolesDecorator } from "../auth/roles/RolesDecorator";
import { Roles } from "src/common/database/Enums";
import { JwtAuthGuard } from "../auth/user/AuthGuard";
import { RolesGuard } from "../auth/roles/RoleGuard";
import { UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";

@ApiTags("Client Cards")
@Controller("client-card")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClientCardController {
	constructor(private readonly clientCardService: ClientCardService) {}

	@Get("find-all/:clientId")
  @RolesDecorator(Roles.STORE_ADMIN)
	findAll(@Param("clientId", ParseUUIDPipe) clientId: string, @CurrentLanguage() lang: string) {
		return this.clientCardService.findAll(lang, { where: { client: { id: clientId } } });
	}
}
