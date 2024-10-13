import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { OverviewModule } from "./overview/overview.module";
import { TechniquesModule } from "./techniques/techniques.module";
import { PrismaModule } from "./recipes/prisma/prisma.module";
import { MembersModule } from "./cerbos-authorization/members/members.module";

export function setupSwagger(app: INestApplication) {
	const authOption = new DocumentBuilder()
		.setTitle("Cerbos Authorization")
		.setDescription("# Cerbos Authorization")
		.setVersion("1.0.0")
		.addBearerAuth()
		.build();
	const authDocument = SwaggerModule.createDocument(app, authOption, {
		include: [MembersModule],
	});
	SwaggerModule.setup("api/cerbos-authorization", app, authDocument);

	const overviewOption = new DocumentBuilder()
		.setTitle("overview")
		.setDescription("# Overview")
		.setVersion("1.0.0")
		.addBearerAuth()
		.build();
	const overviewDocument = SwaggerModule.createDocument(app, overviewOption, {
		include: [OverviewModule],
	});
	SwaggerModule.setup("api/overview", app, overviewDocument);

	const techniquesOption = new DocumentBuilder()
		.setTitle("techniques")
		.setDescription("# Techniques")
		.setVersion("1.0.0")
		.addBearerAuth()
		.build();
	const techniquesDocument = SwaggerModule.createDocument(
		app,
		techniquesOption,
		{
			include: [TechniquesModule],
		}
	);
	SwaggerModule.setup("api/techniques", app, techniquesDocument);

	const prismaOption = new DocumentBuilder()
		.setTitle("prisma")
		.setDescription("# Prisma")
		.setVersion("1.0.0")
		.addBearerAuth()
		.build();
	const prismaDocument = SwaggerModule.createDocument(app, prismaOption, {
		include: [PrismaModule],
	});
	SwaggerModule.setup("api/recipes/prisma", app, prismaDocument);
}
