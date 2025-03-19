import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";
import { ContractPaymentService } from "./contract-payment.service";
import { CreateContractPaymentDto } from "./dto/create-contract-payment.dto";
import { UpdateContractPaymentDto } from "./dto/update-contract-payment.dto";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RolesDecorator } from "../auth/roles/RolesDecorator";
import { Roles } from "src/common/database/Enums";
import { JwtAuthGuard } from "../auth/user/AuthGuard";
import { RolesGuard } from "../auth/roles/RoleGuard";
import { CurrentLanguage } from "src/common/decorator/current-language";
import { CurrentUser } from "src/common/decorator/current-user";
import { AdminEntity, ContractPaymentEntity, StoreEntity } from "src/core/entity";

@ApiTags("Contract payments")
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("contract-payment")
export class ContractPaymentController {
	constructor(private readonly contractPaymentService: ContractPaymentService) {}

	@ApiOperation({ summary: "Create contract payment api for stores" })
	@ApiResponse({ status: 201, type: ContractPaymentEntity, description: "return created data" })
	@ApiBearerAuth()
	@RolesDecorator(Roles.STORE_ADMIN)
	@Post()
	public create(
		@Body() dto: CreateContractPaymentDto,
		@CurrentLanguage() lang: string,
		@CurrentUser() store: StoreEntity,
	) {
		return this.contractPaymentService.createContractPayment(dto, lang, store);
	}

	@ApiOperation({ summary: "find all contract payment api for stores" })
	@ApiResponse({ status: 200, type: [ContractPaymentEntity], description: "return found data" })
	@ApiBearerAuth()
	@RolesDecorator(Roles.STORE_ADMIN, Roles.SUPER_ADMIN, Roles.ADMIN)
	@Get()
	public findAll(
		@CurrentLanguage() lang: string,
		@CurrentUser() user: StoreEntity | AdminEntity,
	) {
		return this.contractPaymentService.findAllContractPayment(lang, user);
	}

	@ApiOperation({ summary: "find one contract payment api for stores" })
	@ApiResponse({ status: 200, type: ContractPaymentEntity, description: "return found data" })
	@ApiBearerAuth()
	@RolesDecorator(Roles.STORE_ADMIN, Roles.SUPER_ADMIN, Roles.ADMIN)
	@Get(":id")
	public findOne(
		@Param("id") id: string,
		@CurrentLanguage() lang: string,
		@CurrentUser() user: StoreEntity | AdminEntity,
	) {
		let where = {};
		if (user.role == Roles.STORE_ADMIN) {
			where = { store: user };
		}
		return this.contractPaymentService.findOneById(id, lang, {
			where,
			relations: { client: true, store: true, contract: true },
		});
	}
}
