import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { OverviewModule } from './overview/overview.module';
import { TechniquesModule } from './techniques/techniques.module';
import { TencentCosObjectsModule } from './tencent-cos-objects/tencent-cos-objects.module';

@Module({
	imports: [OverviewModule, TechniquesModule, TencentCosObjectsModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
