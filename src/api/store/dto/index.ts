import { IsBooleanString, IsNotEmpty } from "class-validator";

export { CreateStoreDto } from "./create-store.dto";
export { UpdateStoreDto } from "./update-store.dto";

export class BlockingOrUnblockingDto {
	@IsNotEmpty()
	@IsBooleanString()
	public is_active!: boolean;
}
