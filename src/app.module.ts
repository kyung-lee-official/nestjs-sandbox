import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { OverviewModule } from './overview/overview.module';
import { TechniquesModule } from './techniques/techniques.module';

@Module({
	imports: [OverviewModule, TechniquesModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
