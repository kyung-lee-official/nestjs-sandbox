import { Module } from "@nestjs/common";
import { MembersService } from "./members.service";
import { MembersController } from "./members.controller";
import { PrismaModule } from "src/recipes/prisma/prisma.module";

@Module({
	imports: [PrismaModule],
	controllers: [MembersController],
	providers: [MembersService],
})
export class MembersModule {}
