import { Module } from "@nestjs/common";
import { PerformancesService } from "./performances.service";
import { PerformancesController } from "./performances.controller";
import { PrismaModule } from "src/recipes/prisma/prisma.module";

@Module({
	imports: [PrismaModule],
	controllers: [PerformancesController],
	providers: [PerformancesService],
})
export class PerformancesModule {}
