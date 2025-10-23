import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { UpdatePaymentDto } from "./dto/update-payment.dto";
import { LoginDto } from "./dto/login.dto";
import { BindCardDto } from "./dto/bind-card.dto";
import { ConfirmCardDto } from "./dto/confirm-card.dto";
import { CurrentUser } from "src/common/decorator/current-user";
import { StoreEntity } from "src/core/entity";
import { RolesDecorator } from "../auth/roles/RolesDecorator";
import { Roles } from "src/common/database/Enums";
import { JwtAuthGuard } from "../auth/user/AuthGuard";
import { UseGuards } from "@nestjs/common";
import { RolesGuard } from "../auth/roles/RoleGuard";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Payment")
@Controller("payment")
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentController {
	constructor(private readonly paymentService: PaymentService) {}

	@Post("login")
	login(@Body() dto: LoginDto) {
		return this.paymentService.login(dto);
	}

	@Post("callback")
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
