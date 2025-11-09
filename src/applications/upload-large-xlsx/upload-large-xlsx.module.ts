import { Module } from "@nestjs/common";
import { UploadLargeXlsxService } from "./upload-large-xlsx.service";
import { UploadLargeXlsxController } from "./upload-large-xlsx.controller";
import { UploadLargeXlsxGateway } from "./upload-large-xlsx.gateway";
import { FileProcessingProcessor } from "./processors/file-processing.processor";
import { RedisStorageService } from "./services/redis-storage.service";
import { BullQueueService } from "./services/bull-queue.service";
import { PrismaModule } from "../../recipes/prisma/prisma.module";
import { RedisModule } from "../../redis/redis.module";

@Module({
	imports: [PrismaModule, RedisModule],
	controllers: [UploadLargeXlsxController],
	providers: [
		UploadLargeXlsxService,
		UploadLargeXlsxGateway,
		RedisStorageService,
		BullQueueService,
		FileProcessingProcessor,
	],
	exports: [UploadLargeXlsxService],
})
export class UploadLargeXlsxModule {}
