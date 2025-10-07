import { Injectable } from "@nestjs/common";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { UpdatePaymentDto } from "./dto/update-payment.dto";
import { LoginDto } from "./dto/login.dto";
import axios from "axios";

@Injectable()
export class PaymentService {
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

	create(createPaymentDto: CreatePaymentDto) {
		return "This action adds a new payment";
	}

	findAll() {
		return `This action returns all payment`;
	}

	findOne(id: number) {
		return `This action returns a #${id} payment`;
	}

	update(id: number, updatePaymentDto: UpdatePaymentDto) {
		return `This action updates a #${id} payment`;
	}

	remove(id: number) {
		return `This action removes a #${id} payment`;
	}
}
