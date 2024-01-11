import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
// import { ExampleModule } from "./example/example.module";

export function setupSwagger(app: INestApplication) {
	// const exampleOption = new DocumentBuilder()
	// 	.setTitle("example")
	// 	.setDescription("# The example API description")
	// 	.setVersion("1.0.0")
	// 	.addBearerAuth()
	// 	.build();
	// const exampleDocument = SwaggerModule.createDocument(app, exampleOption, {
	// 	include: [ExampleModule],
	// });
	// SwaggerModule.setup("api/example", app, exampleDocument);
}
