import { Injectable } from "@nestjs/common";
import { CreateRoleDto } from "./dto/create-role.dto";
// import { UpdateRoleDto } from "./dto/update-role.dto";
import { PrismaService } from "src/recipes/prisma/prisma.service";
import { UpdateRoleDto } from "./dto/update-role.dto";

@Injectable()
export class RolesService {
	constructor(private readonly prismaService: PrismaService) {}

	async create(createRoleDto: CreateRoleDto) {
		const { id } = createRoleDto;
		return await this.prismaService.role.create({
			data: {
				id,
			},
		});
	}

	async findAll() {
		return await this.prismaService.role.findMany({
			include: {
				members: true,
			},
		});
	}

	async findOne(id: string) {
		return await this.prismaService.role.findUnique({
			where: {
				id,
			},
		});
	}

	async update(updateRoleDto: UpdateRoleDto) {
		const { id, members } = updateRoleDto;
		return await this.prismaService.role.update({
			where: {
				id,
			},
			data: {
				members: {
					connect: members.map((member) => ({
						id: member,
					})),
				},
			},
		});
	}

	async remove(id: string) {
		return await this.prismaService.role.delete({
			where: {
				id,
			},
		});
	}
}
