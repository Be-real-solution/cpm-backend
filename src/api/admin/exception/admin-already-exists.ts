import { HttpException } from "@nestjs/common";
import { getErrorMessage } from "src/infrastructure/lib/prompts/errorPrompt";

export class AdminAlreadyExists extends HttpException {
	constructor() {
		super(JSON.stringify(getErrorMessage("application", "admin_already_exists")), 409);
	}
}
