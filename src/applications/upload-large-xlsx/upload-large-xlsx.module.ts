import { Module } from "@nestjs/common";
import { UploadLargeXlsxService } from "./upload-large-xlsx.service";
import { UploadLargeXlsxController } from "./upload-large-xlsx.controller";
import { PrismaModule } from "../../recipes/prisma/prisma.module";

@Module({
	imports: [PrismaModule],
	controllers: [UploadLargeXlsxController],
	providers: [UploadLargeXlsxService],
	exports: [UploadLargeXlsxService],
})
export class UploadLargeXlsxModule {}
