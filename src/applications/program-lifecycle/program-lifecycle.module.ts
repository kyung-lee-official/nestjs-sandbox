import { Module } from "@nestjs/common";
import { ProgramLifecycleService } from "./program-lifecycle.service";
import { ProgramLifecycleController } from "./program-lifecycle.controller";
import { PrismaModule } from "src/recipes/prisma/prisma.module";

@Module({
	imports: [PrismaModule],
	controllers: [ProgramLifecycleController],
	providers: [ProgramLifecycleService],
})
export class ProgramLifecycleModule {}
