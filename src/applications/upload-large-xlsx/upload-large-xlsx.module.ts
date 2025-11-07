import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { UploadLargeXlsxService } from "./upload-large-xlsx.service";
import { UploadLargeXlsxController } from "./upload-large-xlsx.controller";
import { UploadLargeXlsxGateway } from "./upload-large-xlsx.gateway";
import {
	UploadXlsxProcessingProcessor,
	UploadXlsxValidationProcessor,
	UploadXlsxSavingProcessor,
} from "./upload-large-xlsx.queue";
import { PrismaModule } from "../../recipes/prisma/prisma.module";

@Module({
	imports: [
		PrismaModule,
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
		UploadXlsxProcessingProcessor,
		UploadXlsxValidationProcessor,
		UploadXlsxSavingProcessor,
	],
	exports: [UploadLargeXlsxService, UploadLargeXlsxGateway],
})
export class UploadLargeXlsxModule {}
