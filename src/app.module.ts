import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { OverviewModule } from './overview/overview.module';

@Module({
	imports: [OverviewModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
