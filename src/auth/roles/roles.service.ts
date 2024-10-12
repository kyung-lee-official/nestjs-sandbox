import { Injectable } from "@nestjs/common";
import { CreateRoleDto } from "./dto/create-role.dto";
import { PrismaService } from "src/recipes/prisma/prisma.service";

@Injectable()
export class RolesService {
	constructor(private readonly prismaService: PrismaService) {}

	async create(createRoleDto: CreateRoleDto) {
		const { id } = createRoleDto;
		const role = await this.prismaService.role.create({
			data: { id },
		});
		return role;
	}

	async findAll() {
		const roles = await this.prismaService.role.findMany();
		return roles;
	}

	findOne(id: number) {
		return `This action returns a #${id} role`;
	}

	//   update(id: number, updateRoleDto: UpdateRoleDto) {
	//     return `This action updates a #${id} role`;
	//   }

	async remove(id: string) {
		const role = await this.prismaService.role.delete({
			where: { id },
		});
		return role;
	}
}
