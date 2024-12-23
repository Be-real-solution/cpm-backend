import { HttpException } from "@nestjs/common";
import { getErrorMessage } from "src/infrastructure/lib/prompts/errorPrompt";

export class PassportOrPinflAlreadyExists extends HttpException {
	constructor() {
		super(JSON.stringify(getErrorMessage("application", "passport_or_pinfl_already_exists")), 409);
	}
}
