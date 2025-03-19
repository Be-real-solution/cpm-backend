import { HttpException } from "@nestjs/common";
import { getErrorMessage } from "src/infrastructure/lib/prompts/errorPrompt";

export class IncorrectPaymentDate extends HttpException {
	constructor() {
		super(JSON.stringify(getErrorMessage("application", "incorrect_payment_date")), 400);
	}
}
