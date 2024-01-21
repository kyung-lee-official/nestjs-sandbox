import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { OverviewModule } from "./overview/overview.module";
import { TechniquesModule } from "./techniques/techniques.module";
import { TencentCosObjectsModule } from "./tencent-cos-objects/tencent-cos-objects.module";
import { TestMiddleware } from "./overview/middleware/test.middleware";
import { RecipesModule } from './recipes/recipes.module';

@Module({
	imports: [OverviewModule, TechniquesModule, TencentCosObjectsModule, RecipesModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(TestMiddleware).forRoutes("*");
	}
}
