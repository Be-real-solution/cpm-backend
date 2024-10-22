import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AdminEntity, StoreEntity } from "src/core/entity";
import { JwtToken } from "src/infrastructure/lib/jwt-token";
import { AdminModule } from "../admin/admin.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./user/AuthStrategy";

@Module({
	imports: [
		TypeOrmModule.forFeature([ AdminEntity, StoreEntity]),
		JwtModule,
		AdminModule,
	],
	controllers: [AuthController],
	providers: [AuthService, JwtToken, JwtStrategy],
})
export class AuthModule {}
