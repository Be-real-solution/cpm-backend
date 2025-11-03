import { Injectable } from "@nestjs/common";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { UpdatePaymentDto } from "./dto/update-payment.dto";
import { LoginDto } from "./dto/login.dto";
import axios from "axios";
import { AtmosEntity, StoreEntity } from "src/core/entity";
import { AtmosRepository } from "src/core/repository/atmos.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { MoreThan } from "typeorm";
import { BindCardDto } from "./dto/bind-card.dto";
import { ConfirmCardDto } from "./dto/confirm-card.dto";
import { ClientService } from "../client/client.service";
import { CreatePayDto } from "./dto/create-pay.dto";
import { ConfirmPayDto } from "./dto/confirm-pay.dto";

@Injectable()
export class PaymentService {
	constructor(
		@InjectRepository(AtmosEntity) private readonly atmosRepository: AtmosRepository,
		private readonly clientService: ClientService,
	) {}

	async login(dto: LoginDto) {
		const text = "kSfO0x9dVURzWD18f4Ch9MuMzUoa" + ":42cOiZrgWwPUGqIE9A8dQ0_Ju0Aa";
		const base64 = Buffer.from(text).toString("base64");
		console.log(base64); // U2Fsb20gRHVueW8h

		const { url, body, headers, method } = dto;
		console.log(url, body, headers, method);
		const response = await axios({
			url,
			data: body,
			headers,
			method,
		});

		console.log(response.data);
		return response.data;
	}

	async generateToken() {
		const text = "kSfO0x9dVURzWD18f4Ch9MuMzUoa" + ":42cOiZrgWwPUGqIE9A8dQ0_Ju0Aa";
		const key = Buffer.from(text).toString("base64");

		const token = await axios({
			url: "https://apigw.atmos.uz/token",
			method: "POST",
			data: {
				grant_type: "client_credentials",
			},
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				Authorization: "Basic " + key,
			},
		});

		return token.data;
	}

	async bindCard(dto: BindCardDto) {
		const token = await this.getToken();

		const bindCard = await axios({
			url: "https://apigw.atmos.uz/partner/bind-card/init",
			method: "POST",
			data: {
				card_number: dto.card_number,
				expiry: dto.expire,
			},
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});

		return bindCard.data;
	}

	async confirmCard(dto: ConfirmCardDto, user: StoreEntity) {
		const token = await this.getToken();

		const bindCard = await axios({
			url: "https://apigw.atmos.uz/partner/bind-card/confirm",
			method: "POST",
			data: {
				transaction_id: dto.transaction_id,
				otp: dto.otp,
			},
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});

		await this.clientService.bindClientCard({
			store_id: user.id,
			client_id: dto.client_id,
			result: bindCard.data.result,
			data: bindCard.data.data,
			transaction_id: bindCard.data.transaction_id,
		});
		return { status_code: 200, data: {}, message: "Card binded successfully" };
	}

	async createPay(dto: CreatePayDto, user: StoreEntity) {
		const token = await this.getToken();

		dto.amount = this.convertSomToTiyn(dto.amount)

		const pay = await axios({
			url: "https://apigw.atmos.uz/merchant/pay/create",
			method: "POST",
			data: {
				amount: dto.amount,
				// account: dto.account,
				// terminal_id: dto.terminal_id,
				store_id: dto.store_id,
				lang: "uz",
			},
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});

		return pay.data;
	}

	async confirmPay(dto: ConfirmPayDto) {
		const token = await this.getToken();

		const confirmPay = await axios({
			url: "https://apigw.atmos.uz/merchant/pay/pre-apply",
			method: "POST",
			data: {
				card_token: dto.card_token,
				store_id: dto.store_id,
				transaction_id: dto.transaction_id,
			},
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});

		return confirmPay.data;
	}

	private async getToken(): Promise<string> {
		const token = await this.atmosRepository.findOne({
			where: {
				expire: MoreThan(Date.now()),
			},
		});

		if (token) {
			return token.token;
		}

		const newToken = await this.generateToken();
		await this.atmosRepository.save({
			token: newToken.access_token,
			expire: Date.now() + newToken.expires_in * 1000 - 1000,
		});

		return newToken.access_token;
	}

	private convertSomToTiyn(amount: number) {
		return amount * 100;
	}
}
