import { HttpException } from "@nestjs/common";
import { getErrorMessage } from "src/infrastructure/lib/prompts/errorPrompt";

export class PaymentAlreadyPaid extends HttpException {
	constructor() {
		super(JSON.stringify(getErrorMessage("application", "payment_already_paid")), 400);
	}
}
