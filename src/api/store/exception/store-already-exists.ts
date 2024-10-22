import { HttpException } from "@nestjs/common";
import { getErrorMessage } from "src/infrastructure/lib/prompts/errorPrompt";

export class StoreAlreadyExists extends HttpException {
	constructor() {
		super(JSON.stringify(getErrorMessage("application", "store_already_exists")), 400);
	}
}
