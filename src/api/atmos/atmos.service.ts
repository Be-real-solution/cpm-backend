import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import axios from "axios";
import { AtmosEntity } from "src/core/entity";
import { AtmosRepository } from "src/core/repository/atmos.repository";
import { MoreThan } from "typeorm";
import { BindCardDto } from "./dto/bind-card.dto";

@Injectable()
export class AtmosService {
	constructor(@InjectRepository(AtmosEntity) private readonly atmosRepository: AtmosRepository) {}

	async generateToken() {
		const text = "kSfO0x9dVURzWD18f4Ch9MuMzUoa" + ":42cOiZrgWwPUGqIE9A8dQ0_Ju0Aa";
		const key = Buffer.from(text).toString("base64");

		console.log(key);

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

	async confirmCard(transactionId: number, otp: string) {
		const token = await this.getToken();

		const bindCard = await axios({
      url: "https://apigw.atmos.uz/partner/bind-card/confirm",
      method: "POST",
			data: {
				transaction_id: transactionId,
				otp: otp,
			},
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});

		return bindCard.data;
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
}
