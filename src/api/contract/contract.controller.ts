import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Roles } from "src/common/database/Enums";
import { CurrentLanguage } from "src/common/decorator/current-language";
import { CurrentUser } from "src/common/decorator/current-user";
import { AdminEntity, ContractEntity, StoreEntity } from "src/core/entity";
import { RolesGuard } from "../auth/roles/RoleGuard";
import { RolesDecorator } from "../auth/roles/RolesDecorator";
import { JwtAuthGuard } from "../auth/user/AuthGuard";
import { ContractService } from "./contract.service";
import { CreateContractDto } from "./dto/create-contract.dto";

@ApiTags("Contracts")
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("contract")
export class ContractController {
	constructor(private readonly contractService: ContractService) {}

	@ApiOperation({ summary: "Create contract api for stores" })
	@ApiResponse({ status: 201, description: "return empty data" })
	@ApiBearerAuth()
	@RolesDecorator(Roles.STORE_ADMIN)
	@Post()
	public create(
		@Body() dto: CreateContractDto,
		@CurrentLanguage() lang: string,
		@CurrentUser() store: StoreEntity,
	) {
		return this.contractService.createContract(dto, lang, store);
	}

	@ApiOperation({ summary: "Calculate contract payment api for stores" })
	@ApiResponse({ status: 200, description: "return calculated data" })
	@ApiBearerAuth()
	@RolesDecorator(Roles.STORE_ADMIN)
	@Post("calculate-payment")
	public calculateContractPayment(
		@Body() dto: CreateContractDto,
		@CurrentLanguage() lang: string,
	) {
		return this.contractService.calculateContractPayment(dto, lang);
	}

	@ApiOperation({ summary: "finda all contract api for stores and admins" })
	@ApiResponse({ status: 200, type: [ContractEntity], description: "return found data" })
	@ApiBearerAuth()
	@RolesDecorator(Roles.STORE_ADMIN, Roles.SUPER_ADMIN, Roles.ADMIN)
	@Get()
	public findAll(
		@CurrentLanguage() lang: string,
		@CurrentUser() user: StoreEntity | AdminEntity,
	) {
		return this.contractService.findAllContract(lang, user);
	}

	@ApiOperation({ summary: "find one contract api for stores and admins" })
	@ApiResponse({ status: 200, type: ContractEntity, description: "return found data" })
	@ApiBearerAuth()
	@RolesDecorator(Roles.STORE_ADMIN, Roles.SUPER_ADMIN, Roles.ADMIN)
	@Get(":id")
	public findOne(
		@Param("id") id: string,
		@CurrentLanguage() lang: string,
		@CurrentUser() user: StoreEntity | AdminEntity,
	) {
		return this.contractService.findOneContract(id, lang, user);
	}
}
