import { Module } from "@nestjs/common";
import { AssessmentsService } from "./assessments.service";
import { AssessmentsController } from "./assessments.controller";

@Module({
	controllers: [AssessmentsController],
	providers: [AssessmentsService],
})
export class AssessmentsModule {}
