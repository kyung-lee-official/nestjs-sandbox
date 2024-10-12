import { Module } from "@nestjs/common";
import { AuthenticationService } from "./authentication.service";
import { AuthenticationController } from "./authentication.controller";
import { JwtModule } from "@nestjs/jwt";
import { PrismaModule } from "src/recipes/prisma/prisma.module";

@Module({
	imports: [
		PrismaModule,
		JwtModule.register({
			global: true,
			secret: process.env.SECRET,
			signOptions: { expiresIn: "60s" },
		}),
	],
	controllers: [AuthenticationController],
	providers: [AuthenticationService],
})
export class AuthenticationModule {}
