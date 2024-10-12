import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { OverviewModule } from "./overview/overview.module";
import { TechniquesModule } from "./techniques/techniques.module";
import { TencentCosObjectsModule } from "./tencent-cos-objects/tencent-cos-objects.module";
import { TestMiddleware } from "./overview/middleware/test.middleware";
import { PrismaModule } from "./recipes/prisma/prisma.module";
import { WebsocketsModule } from './websockets/websockets.module';
import { MembersModule } from './cerbos-authorization/members/members.module';

@Module({
	imports: [
		OverviewModule,
		TechniquesModule,
		TencentCosObjectsModule,
		PrismaModule,
		WebsocketsModule,
		MembersModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(TestMiddleware).forRoutes("*");
	}
}
