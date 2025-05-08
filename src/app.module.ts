import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { OverviewModule } from "./overview/overview.module";
import { TechniquesModule } from "./techniques/techniques.module";
import { TencentCosObjectsModule } from "./tencent-cos-objects/tencent-cos-objects.module";
import { TestMiddleware } from "./overview/middleware/test.middleware";
import { PrismaModule } from "./recipes/prisma/prisma.module";
import { WebsocketsModule } from "./websockets/websockets.module";
import { MembersModule } from "./cerbos-authorization/members/members.module";
import { AuthneticationModule } from "./cerbos-authorization/authnetication/authnetication.module";
import { RolesModule } from "./cerbos-authorization/roles/roles.module";
import { PerformancesModule } from "./cerbos-authorization/performances/performances.module";
import { AssessmentsModule } from "./cerbos-authorization/assessments/assessments.module";
import { ProgramLifecycleModule } from "./applications/program-lifecycle/program-lifecycle.module";
import { UploadLargeJsonModule } from "./upload-large-json/upload-large-json.module";
import { BullModule } from "@nestjs/bullmq";
import { MockDataModule } from "./applications/mock-data/mock-data.module";
import { ResendModule } from './applications/resend/resend.module';

@Module({
	imports: [
		OverviewModule,
		TechniquesModule,
		TencentCosObjectsModule,
		PrismaModule,
		WebsocketsModule,
		MembersModule,
		AuthneticationModule,
		RolesModule,
		PerformancesModule,
		AssessmentsModule,
		ProgramLifecycleModule,
		MockDataModule,
		UploadLargeJsonModule,
		BullModule.forRoot({
			connection: {
				host: process.env.REDIS_HOST,
				port: Number(process.env.REDIS_PORT),
			},
		}),
		ResendModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(TestMiddleware).forRoutes("*");
	}
}
