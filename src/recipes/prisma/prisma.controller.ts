import { Controller, Get, Post, Body, Patch } from "@nestjs/common";
import { ApiBody, ApiOkResponse, ApiOperation } from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { CategoriesService } from "./categories.service";
import { PostsService } from "./posts.service";
import {
	User as UserModel,
	Post as PostModel,
	Event as EventModel,
	Category as CategoryModel,
} from "@prisma/client";
import { CreateUserDto } from "./dto/create-user.dto";
import { CreatePostDto } from "./dto/create-post.dto";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { FindPostDto } from "./dto/find-posts.dto";
import { JsonFieldFilterDto } from "./dto/json-field-filter";
import { CreateEventDto } from "./dto/create-event.dto";
import { EventsService } from "./events.service";

@Controller("prisma")
export class PrismaController {
	constructor(
		private readonly usersService: UsersService,
		private readonly postsService: PostsService,
		private readonly categoriesService: CategoriesService,
		private readonly eventsService: EventsService
	) {}

	@ApiOperation({ summary: "Create a new user" })
	@ApiBody({
		type: CreateUserDto,
		examples: {
			Alice: {
				value: {
					name: "Alice",
					email: "alice@prisma.io",
					recoveryEmails: ["alice@gmail.com", "alice@outlook.com"],
					titles: [
						{
							title: "Bachelor",
							field: "Computer Science",
						},
						{
							title: "Master",
							field: "Physics",
						},
					],
				},
			},
			Bob: {
				value: {
					name: "Bob",
					email: "bob@prisma.io",
					recoveryEmails: ["bob@gmail.com"],
					titles: [
						{
							title: "PhD",
							field: "Physics",
						},
					],
				},
			},
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
							email: "alice@prisma.io",
							recoveryEmails: [
								"alice@gmail.com",
								"alice@outlook.com",
							],
							name: "Alice",
							titles: {
								create: [
									{
										field: "Computer Science",
										title: "Bachelor",
									},
									{
										field: "Physics",
										title: "Master",
									},
								],
							},
							createdAt: "2024-02-04T09:39:34.049Z",
							updatedAt: "2024-02-04T09:39:34.049Z",
						},
					},
				},
			},
		},
	})
	@Post("user")
	async createUser(@Body() createUserDto: CreateUserDto): Promise<UserModel> {
		return this.usersService.createUser(createUserDto);
	}

	@ApiOperation({ summary: "Get all users" })
	@Get("users")
	async getAllUsers(): Promise<UserModel[]> {
		return this.usersService.getAllUsers();
	}

	@ApiOperation({ summary: "Find users by JSON field" })
	@ApiBody({
		type: JsonFieldFilterDto,
		examples: {
			"Find users with recovery email": {
				value: {
					recoveryEmail: "alice@gmail.com",
				},
			},
		},
	})
	@Post("users/find-by-json-field")
	async findUsersByJsonField(@Body() jsonFieldFilter: JsonFieldFilterDto) {
		return this.usersService.findUsersByJsonField(jsonFieldFilter);
	}

	@ApiOperation({ summary: "Create a post" })
	@ApiBody({
		type: CreatePostDto,
		examples: {
			"Post 1": {
				value: {
					title: "Post 1",
					slug: "post-1",
					userEmail: "alice@prisma.io",
				},
			},
			"Post 2": {
				value: {
					title: "Post 2",
					slug: "post-2",
					userEmail: "alice@prisma.io",
				},
			},
			"Post 3": {
				value: {
					title: "Post 3",
					slug: "post-3",
					userEmail: "bob@prisma.io",
				},
			},
		},
	})
	@Post("post")
	async createPost(@Body() createPostDto: CreatePostDto): Promise<PostModel> {
		return this.postsService.createPost(createPostDto);
	}

	@ApiOperation({ summary: "Get all posts" })
	@Get("posts")
	async getAllPosts(): Promise<PostModel[]> {
		return this.postsService.getAllPosts();
	}

	@ApiOperation({ summary: "Find many posts" })
	@ApiBody({
		type: FindPostDto,
		examples: {
			"Should contain Post 2 only": {
				value: {
					slugs: ["post-2", "post-3"],
					categoryNames: ["Category 1"],
				},
			},
			"Should contain no posts": {
				value: {
					slugs: ["post-2", "post-3"],
					categoryNames: ["Category 2"],
				},
			},
		},
	})
	@Post("posts/find-many")
	async findPosts(@Body() findPostDto: FindPostDto): Promise<PostModel[]> {
		return this.postsService.findPosts(findPostDto);
	}

	@ApiOperation({ summary: "Create a category" })
	@ApiBody({
		type: CreateCategoryDto,
		examples: {
			"Category 1": {
				value: {
					name: "Category 1",
				},
			},
			"Category 2": {
				value: {
					name: "Category 2",
				},
			},
			"Category 3": {
				value: {
					name: "Category 3",
				},
			},
		},
	})
	@Post("category")
	async createCategory(
		@Body() createCategoryDto: CreateCategoryDto
	): Promise<CategoryModel> {
		return this.categoriesService.createCategory(createCategoryDto);
	}

	@ApiOperation({ summary: "Get all categories" })
	@Get("categories")
	async getAllCategories(): Promise<CategoryModel[]> {
		return this.categoriesService.getAllCategories();
	}

	@ApiOperation({ summary: "Update a category" })
	@ApiBody({
		type: UpdateCategoryDto,
		examples: {
			"Category 1": {
				value: {
					name: "Category 1",
					postSlugs: ["post-1", "post-2"],
				},
			},
		},
	})
	@Patch("category")
	async updateCategory(
		@Body() updateCategoryDto: UpdateCategoryDto
	): Promise<CategoryModel> {
		return this.categoriesService.updateCategory(updateCategoryDto);
	}

	@ApiOperation({
		summary: "Create an event",
		description:
			"Create a new event. this event requires a startAt property (Date), used for testing date string format",
	})
	@ApiBody({
		type: CreateEventDto,
		examples: {
			"Event 1": {
				value: {
					name: "Event 1",
					startAt: "2024-02-04T20:39:34.049Z",
				},
			},
		},
	})
	@Post("event")
	async createEvent(
		@Body() createEventDto: CreateEventDto
	): Promise<EventModel> {
		return this.eventsService.createEvent(createEventDto);
	}

	@ApiOperation({ summary: "Get all events" })
	@Get("events")
	async getAllEvents(): Promise<EventModel[]> {
		return this.eventsService.getAllEvents();
	}
}
