import { Injectable } from "@nestjs/common";
import { CreateRecipeDto } from "./dto/create-recipe.dto";
import { UpdateRecipeDto } from "./dto/update-recipe.dto";
import { PrismaService } from "./prisma.service";
import { Post, Prisma, User } from "@prisma/client";

@Injectable()
export class RecipesService {
	constructor(private prisma: PrismaService) {}

	async prismaUser(
		userWhereUniqueInput: Prisma.UserWhereUniqueInput
	): Promise<User | null> {
		return this.prisma.user.findUnique({
			where: userWhereUniqueInput,
		});
	}

	async prismaUsers(userData: {
		skip?: number;
		take?: number;
		cursor?: Prisma.UserWhereUniqueInput;
		where?: Prisma.UserWhereInput;
		orderBy?: Prisma.UserOrderByWithRelationInput;
	}): Promise<User[]> {
		const { skip, take, cursor, where, orderBy } = userData;
		return this.prisma.user.findMany({
			skip,
			take,
			cursor,
			where,
			orderBy,
		});
	}

	async createPrismaUser(data: Prisma.UserCreateInput): Promise<User> {
		return this.prisma.user.create({
			data,
		});
	}

	async updatePrismaUser(params: {
		where: Prisma.UserWhereUniqueInput;
		data: Prisma.UserUpdateInput;
	}): Promise<User> {
		const { where, data } = params;
		return this.prisma.user.update({
			data,
			where,
		});
	}

	async deletePrismaUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
		return this.prisma.user.delete({
			where,
		});
	}

	async prismaPost(
		postWhereUniqueInput: Prisma.PostWhereUniqueInput
	): Promise<Post | null> {
		return this.prisma.post.findUnique({
			where: postWhereUniqueInput,
		});
	}

	async prismaPosts(params: {
		skip?: number;
		take?: number;
		cursor?: Prisma.PostWhereUniqueInput;
		where?: Prisma.PostWhereInput;
		orderBy?: Prisma.PostOrderByWithRelationInput;
	}): Promise<Post[]> {
		const { skip, take, cursor, where, orderBy } = params;
		return this.prisma.post.findMany({
			skip,
			take,
			cursor,
			where,
			orderBy,
		});
	}

	async createPrismaPost(data: Prisma.PostCreateInput): Promise<Post> {
		return this.prisma.post.create({
			data,
		});
	}

	async updatePrismaPost(params: {
		where: Prisma.PostWhereUniqueInput;
		data: Prisma.PostUpdateInput;
	}): Promise<Post> {
		const { data, where } = params;
		return this.prisma.post.update({
			data,
			where,
		});
	}

	async deletePrismaPost(where: Prisma.PostWhereUniqueInput): Promise<Post> {
		return this.prisma.post.delete({
			where,
		});
	}

	create(createRecipeDto: CreateRecipeDto) {
		return "This action adds a new recipe";
	}

	findAll() {
		return `This action returns all recipes`;
	}

	findOne(id: number) {
		return `This action returns a #${id} recipe`;
	}

	update(id: number, updateRecipeDto: UpdateRecipeDto) {
		return `This action updates a #${id} recipe`;
	}

	remove(id: number) {
		return `This action removes a #${id} recipe`;
	}
}
