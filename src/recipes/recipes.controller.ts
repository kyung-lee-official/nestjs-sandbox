import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Put,
	Query,
} from "@nestjs/common";
import { RecipesService } from "./recipes.service";
import { CreateRecipeDto } from "./dto/create-recipe.dto";
import { UpdateRecipeDto } from "./dto/update-recipe.dto";
import { User as UserModel, Post as PostModel, Prisma } from "@prisma/client";
import {
	ApiBody,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiQuery,
} from "@nestjs/swagger";

@Controller("recipes")
export class RecipesController {
	constructor(private readonly recipesService: RecipesService) {}

	@ApiOperation({ summary: "Create a new user" })
	@ApiBody({
		schema: {
			type: "object",
			properties: {
				name: { type: "string", example: "Alice" },
				email: { type: "string", example: "alice@prisma.io" },
			},
			required: ["email"],
		},
	})
	@ApiOkResponse({
		description: "The user has been successfully created.",
		content: {
			"application/json": {
				examples: {
					Alice: {
						value: {
							id: 1,
							name: "Alice",
							email: "alice@prisma.io",
						},
					},
				},
			},
		},
	})
	@Post("prisma-user")
	async signupUser(
		@Body() userData: { name?: string; email: string }
	): Promise<UserModel> {
		return this.recipesService.createPrismaUser(userData);
	}

	@ApiOperation({ summary: "Get a single user by id" })
	@ApiParam({
		name: "id",
		description: "The id of the user",
		example: "1",
	})
	@ApiOkResponse({
		description: "The user has been successfully retrieved.",
		content: {
			"application/json": {
				examples: {
					Alice: {
						value: {
							id: 1,
							name: "Alice",
							email: "alice@prisma.io",
						},
					},
				},
			},
		},
	})
	@Get("prisma-user/:id")
	async getUserById(@Param("id") id: string): Promise<UserModel> {
		return this.recipesService.prismaUser({ id: Number(id) });
	}

	@ApiOperation({ summary: "Find users" })
	@ApiQuery({
		name: "skip",
		description: "Skip n users (pagination)",
		required: false,
	})
	@ApiQuery({
		name: "take",
		description: "Take n users (pagination)",
		required: false,
	})
	@ApiQuery({
		name: "cursor",
		description: "Cursor for pagination",
		required: false,
	})
	@ApiQuery({
		name: "where",
		description: "Filter which users to fetch",
		required: false,
	})
	@ApiQuery({
		name: "orderBy",
		description: "Order users by a certain criteria",
		required: false,
	})
	@Get("prisma-users")
	async getUsers(
		@Query("skip") skip?: string,
		@Query("take") take?: string,
		@Query("cursor") cursor?: Prisma.UserWhereUniqueInput,
		@Query("where") where?: Prisma.UserWhereInput,
		@Query("orderBy") orderBy?: Prisma.UserOrderByWithRelationInput
	): Promise<UserModel[]> {
		let skipInt: unknown;
		let takeInt: unknown;
		if (skip) {
			skipInt = parseInt(skip);
		}
		if (take) {
			takeInt = parseInt(take);
		}
		return this.recipesService.prismaUsers({
			skip: skipInt as number | undefined,
			take: takeInt as number | undefined,
			cursor,
			where,
			orderBy,
		});
	}

	@Get("prisma-post/:id")
	async getPostById(@Param("id") id: string): Promise<PostModel> {
		return this.recipesService.prismaPost({ id: Number(id) });
	}

	@Get("prisma-feed")
	async getPublishedPosts(): Promise<PostModel[]> {
		return this.recipesService.prismaPosts({
			where: { published: true },
		});
	}

	@Get("prisma-filtered-posts/:searchString")
	async getFilteredPosts(
		@Param("searchString") searchString: string
	): Promise<PostModel[]> {
		return this.recipesService.prismaPosts({
			where: {
				OR: [
					{
						title: { contains: searchString },
					},
					{
						content: { contains: searchString },
					},
				],
			},
		});
	}

	@Post("prisma-post")
	async createDraft(
		@Body()
		postData: {
			title: string;
			content?: string;
			authorEmail: string;
		}
	): Promise<PostModel> {
		const { title, content, authorEmail } = postData;
		return this.recipesService.createPrismaPost({
			title,
			content,
			author: {
				connect: { email: authorEmail },
			},
		});
	}

	@Put("prisma-publish/:id")
	async publishPost(@Param("id") id: string): Promise<PostModel> {
		return this.recipesService.updatePrismaPost({
			where: { id: Number(id) },
			data: { published: true },
		});
	}

	@Delete("prisma-post/:id")
	async deletePost(@Param("id") id: string): Promise<PostModel> {
		return this.recipesService.deletePrismaPost({ id: Number(id) });
	}

	@Post()
	create(@Body() createRecipeDto: CreateRecipeDto) {
		return this.recipesService.create(createRecipeDto);
	}

	@Get()
	findAll() {
		return this.recipesService.findAll();
	}

	@Get(":id")
	findOne(@Param("id") id: string) {
		return this.recipesService.findOne(+id);
	}

	@Patch(":id")
	update(@Param("id") id: string, @Body() updateRecipeDto: UpdateRecipeDto) {
		return this.recipesService.update(+id, updateRecipeDto);
	}

	@Delete(":id")
	remove(@Param("id") id: string) {
		return this.recipesService.remove(+id);
	}
}
