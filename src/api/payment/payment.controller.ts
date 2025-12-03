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
import axios from "axios";
import { CreatePayDto } from "./dto/create-pay.dto";
import { ConfirmPayDto } from "./dto/confirm-pay.dto";

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
	async callback(@Req() req: Request) {
		console.log(req.body);
		console.log(req.headers);
		const url = `https://api.telegram.org/bot6243405014:AAEUzdM3WhJ-KQe1T1gz5UG5msLQhShYqQ4/sendMessage?chat_id=784562004&text=${JSON.stringify(
			req.body,
		)}`;
		await axios.post(url);
		return { status_code: 200, data: {}, message: "Callback received" };
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

	@Post("create-pay")
	createPay(@Body() dto: CreatePayDto, @CurrentUser() user: StoreEntity) {
		return this.paymentService.createPay(dto, user);
	}

	@Post("confirm-pay")
	confirmPay(@Body() dto: ConfirmPayDto) {
		return this.paymentService.confirmPay(dto);
	}
}
