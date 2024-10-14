import { Module } from "@nestjs/common";
import { AuthneticationService } from "./authnetication.service";
import { AuthneticationController } from "./authnetication.controller";
import { PrismaModule } from "src/recipes/prisma/prisma.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
	imports: [
		PrismaModule,
		JwtModule.register({
			global: true,
			secret: process.env.SECRET,
			signOptions: {
				expiresIn: "120s",
			},
		}),
	],
	controllers: [AuthneticationController],
	providers: [AuthneticationService],
})
export class AuthneticationModule {}
