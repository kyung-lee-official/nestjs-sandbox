import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { OverviewModule } from "./overview/overview.module";
import { TechniquesModule } from "./techniques/techniques.module";
import { TencentCosObjectsModule } from "./tencent-cos-objects/tencent-cos-objects.module";
import { TestMiddleware } from "./overview/middleware/test.middleware";
import { PrismaModule } from "./recipes/prisma/prisma.module";
import { WebsocketsModule } from "./websockets/websockets.module";
import { AuthenticationModule } from './auth/authentication/authentication.module';
import { AuthorizationModule } from './auth/authorization/authorization.module';
import { MembersModule } from './auth/members/members.module';
import { RolesModule } from './auth/roles/roles.module';
import { PerformancesModule } from './auth/resources/performances/performances.module';

@Module({
	imports: [
		OverviewModule,
		TechniquesModule,
		TencentCosObjectsModule,
		PrismaModule,
		WebsocketsModule,
		AuthenticationModule,
		AuthorizationModule,
		MembersModule,
		RolesModule,
		PerformancesModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(TestMiddleware).forRoutes("*");
	}
}
