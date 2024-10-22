import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { StoreClientService } from "./store-client.service";
import { CreateStoreClientDto } from "./dto/create-store-client.dto";
import { UpdateStoreClientDto } from "./dto/update-store-client.dto";
import { CurrentLanguage } from "src/common/decorator/current-language";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Store Clients. Not complated")
@Controller("store-client")
export class StoreClientController {
	constructor(private readonly storeClientService: StoreClientService) {}

	@Post()
	public create(@Body() dto: CreateStoreClientDto, @CurrentLanguage() lang: string) {
		return this.storeClientService.create(dto, lang);
	}

	@Get()
	public findAll(@CurrentLanguage() lang: string) {
		return this.storeClientService.findAll(lang);
	}

	@Get(":id")
	public findOne(@Param("id") id: string, @CurrentLanguage() lang: string) {
		return this.storeClientService.findOneById(id, lang);
	}

	@Patch(":id")
	public update(
		@Param("id") id: string,
		@Body() dto: UpdateStoreClientDto,
		@CurrentLanguage() lang: string,
	) {
		return this.storeClientService.update(id, dto, lang);
	}

	@Delete(":id")
	public remove(@Param("id") id: string, @CurrentLanguage() lang: string) {
		return this.storeClientService.delete(id, lang);
	}
}
