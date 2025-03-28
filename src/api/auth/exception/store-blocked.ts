import { HttpException } from "@nestjs/common";
import { getErrorMessage } from "src/infrastructure/lib/prompts/errorPrompt";

export class StoreBlocked extends HttpException {
	constructor() {
		super(JSON.stringify(getErrorMessage("application", "store_blocked")), 423);
	}
}
