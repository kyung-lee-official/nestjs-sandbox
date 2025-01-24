import { Module } from "@nestjs/common";
import { AccessmentsService } from "./accessments.service";
import { AccessmentsController } from "./accessments.controller";

@Module({
	controllers: [AccessmentsController],
	providers: [AccessmentsService],
})
export class AccessmentsModule {}
