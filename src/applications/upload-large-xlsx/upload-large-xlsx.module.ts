import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { UploadLargeXlsxService } from "./upload-large-xlsx.service";
import { UploadLargeXlsxController } from "./upload-large-xlsx.controller";
import { UploadLargeXlsxGateway } from "./upload-large-xlsx.gateway";
import { UploadXlsxProcessingProcessor } from "./upload-large-xlsx.queue/processing.processor";
import { UploadXlsxValidationProcessor } from "./upload-large-xlsx.queue/validation.processor";
import { UploadXlsxSavingProcessor } from "./upload-large-xlsx.queue/saving.processor";
import { UploadLargeXlsxQueueService } from "./upload-large-xlsx.queue/upload-large-xlsx.queue";
import { PrismaModule } from "../../recipes/prisma/prisma.module";
import { RedisModule } from "../../redis/redis.module";
import { UploadLargeXlsxRedisService } from "./redis.service";

@Module({
	imports: [
		PrismaModule,
		RedisModule,
		BullModule.registerQueue(
			{ name: "upload-xlsx-processing" },
			{ name: "upload-xlsx-validation" },
			{ name: "upload-xlsx-saving" }
		),
	],
	controllers: [UploadLargeXlsxController],
	providers: [
		UploadLargeXlsxService,
		UploadLargeXlsxGateway,
		UploadLargeXlsxRedisService,
		UploadLargeXlsxQueueService,
		UploadXlsxProcessingProcessor,
		UploadXlsxValidationProcessor,
		UploadXlsxSavingProcessor,
	],
	exports: [UploadLargeXlsxService],
})
export class UploadLargeXlsxModule {}
