import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { User } from "@prisma/client";
import { CreateUserDto } from "./dto/create-user.dto";
import { JsonFieldFilterDto } from "./dto/json-field-filter";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
	constructor(private prisma: PrismaService) {}

	async createUser(createUserDto: CreateUserDto): Promise<User> {
		return await this.prisma.user.create({
			data: {
				...createUserDto,
				titles: {
					create: createUserDto.titles,
				},
			},
		});
	}

	async getAllUsers(): Promise<User[]> {
		return await this.prisma.user.findMany({
			include: {
				posts: {
					include: {
						categories: true,
					},
				},
			},
		});
	}

	async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
		return await this.prisma.user.update({
			where: { id },
			data: {
				...updateUserDto,
			},
		});
	}

	async findUsersByJsonField(
		JsonFieldFilterDto: JsonFieldFilterDto
	): Promise<User[]> {
		const { recoveryEmail } = JsonFieldFilterDto;
		return await this.prisma.user.findMany({
			where: {
				recoveryEmails: {
					has: recoveryEmail,
				},
			},
		});
	}
}
