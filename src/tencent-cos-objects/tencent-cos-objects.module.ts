import { Module } from "@nestjs/common";
import { TencentCosObjectsService } from "./tencent-cos-objects.service";
import { TencentCosObjectsController } from "./tencent-cos-objects.controller";
import { ConfigModule } from "@nestjs/config";

@Module({
	imports: [ConfigModule.forRoot()],
	controllers: [TencentCosObjectsController],
	providers: [TencentCosObjectsService],
})
export class TencentCosObjectsModule {}
