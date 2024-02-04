import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { Post } from "@prisma/client";
import { CreatePostDto } from "./dto/create-post.dto";
import { FindPostDto } from "./dto/find-posts.dto";

@Injectable()
export class PostsService {
	constructor(private prisma: PrismaService) {}

	async createPost(createPostDto: CreatePostDto): Promise<Post> {
		const { userEmail, ...rest } = createPostDto;
		return await this.prisma.post.create({
			data: {
				...rest,
				author: {
					connect: {
						email: createPostDto.userEmail,
					},
				},
			},
		});
	}

	async getAllPosts(): Promise<Post[]> {
		return await this.prisma.post.findMany({
			include: {
				author: true,
				categories: true,
			},
		});
	}

	async findPosts(findPostDto: FindPostDto): Promise<Post[]> {
		const { slugs, categoryNames } = findPostDto;
		return await this.prisma.post.findMany({
			where: {
				AND: [
					{
						slug: {
							in: slugs,
						},
					},
					{
						categories: {
							some: {
								name: {
									in: categoryNames,
								},
							},
						},
					},
				],
			},
			include: {
				categories: true,
			},
		});
	}
}
