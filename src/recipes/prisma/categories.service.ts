import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Injectable()
export class CategoriesService {
	constructor(private prisma: PrismaService) {}

	async createCategory(createCategoryDto: CreateCategoryDto) {
		const { name } = createCategoryDto;
		return await this.prisma.category.create({
			data: {
				name,
			},
		});
	}

	async getAllCategories() {
		return await this.prisma.category.findMany({
			include: {
				posts: true,
			},
		});
	}

	async updateCategory(updateCategoryDto: UpdateCategoryDto) {
		const { name, postSlugs } = updateCategoryDto;
		return await this.prisma.category.update({
			where: {
				name,
			},
			data: {
				name,
				posts: {
					connect: postSlugs.map((slug) => ({ slug })),
				},
			},
		});
	}
}
