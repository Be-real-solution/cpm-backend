import { HttpException } from "@nestjs/common";
import { getErrorMessage } from "src/infrastructure/lib/prompts/errorPrompt";

export class SentIncorrectPaymentId extends HttpException {
	constructor() {
		super(JSON.stringify(getErrorMessage("application", "sent_incorrect_payment_id")), 400);
	}
}
