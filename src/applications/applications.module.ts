import { Module } from "@nestjs/common";
import { ProgramLifecycleModule } from "./program-lifecycle/program-lifecycle.module";
import { MockDataModule } from "./mock-data/mock-data.module";
import { ResendModule } from "./resend/resend.module";
import { UploadLargeJsonModule } from "./upload-large-json/upload-large-json.module";

@Module({
	imports: [
		ProgramLifecycleModule,
		MockDataModule,
		ResendModule,
		UploadLargeJsonModule,
	],
	exports: [
		ProgramLifecycleModule,
		MockDataModule,
		ResendModule,
		UploadLargeJsonModule,
	],
})
export class ApplicationsModule {}
