import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { PrismaController } from "./prisma.controller";
import { UsersService } from "./users.service";
import { PostsService } from "./posts.service";
import { CategoriesService } from "./categories.service";
import { EventsService } from "./events.service";
import { GroupsService } from "./groups.service";

@Module({
	controllers: [PrismaController],
	providers: [
		PrismaService,
		UsersService,
		PostsService,
		CategoriesService,
		EventsService,
		GroupsService,
	],
	exports: [PrismaService],
})
export class PrismaModule {}
