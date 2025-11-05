import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { PaymentLoginDto } from "./dto/login.dto";
import { BindCardDto } from "./dto/bind-card.dto";
import { ConfirmCardDto } from "./dto/confirm-card.dto";
import { CurrentUser } from "src/common/decorator/current-user";
import { StoreEntity } from "src/core/entity";
import { Public, RolesDecorator } from "../auth/roles/RolesDecorator";
import { Roles } from "src/common/database/Enums";
import { JwtAuthGuard } from "../auth/user/AuthGuard";
import { UseGuards } from "@nestjs/common";
import { RolesGuard } from "../auth/roles/RoleGuard";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";

@ApiTags("Payment")
@Controller("payment")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PaymentController {
	constructor(private readonly paymentService: PaymentService) {}

	@Post("login")
	login(@Body() dto: PaymentLoginDto) {
		return this.paymentService.login(dto);
	}

	@Post("callback")
	@Public()
	callback(@Req() req: Request) {
		console.log(req);
		return {
			status: 1,
			message: "Успешно",
		};
	}

	@Post("bind-card")
	bindCard(@Body() dto: BindCardDto) {
		return this.paymentService.bindCard(dto);
	}

	@Post("confirm-card")
	@RolesDecorator(Roles.STORE_ADMIN)
	confirmCard(@Body() dto: ConfirmCardDto, @CurrentUser() user: StoreEntity) {
		return this.paymentService.confirmCard(dto, user);
	}


}
