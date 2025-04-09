import { Module } from "@nestjs/common";
import { UploadLargeJsonService } from "./upload-large-json.service";
import { UploadLargeJsonController } from "./upload-large-json.controller";
import { UploadLargeJsonQueueService } from "./upload-large-json-queue.service";
import { UploadLargeJsonWorkerService } from "./upload-large-json-worker.service";
import { MockDatabaseService } from "./mock-database.service";
import { UploadLargeJsonGateway } from "./upload-large-json.gateway";
import { BullModule } from "@nestjs/bullmq";

@Module({
	imports: [
		BullModule.registerQueue({
			name: "upload-large-json",
		}),
	],
	controllers: [UploadLargeJsonController],
	providers: [
		UploadLargeJsonService,
		UploadLargeJsonQueueService,
		UploadLargeJsonWorkerService,
		UploadLargeJsonGateway,
		MockDatabaseService,
	],
})
export class UploadLargeJsonModule {}
