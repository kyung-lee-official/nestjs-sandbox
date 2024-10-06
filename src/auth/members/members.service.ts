import { Injectable } from "@nestjs/common";
import { CreateMemberDto } from "./dto/create-member.dto";
import { PrismaService } from "src/recipes/prisma/prisma.service";

@Injectable()
export class MembersService {
	constructor(private readonly prismaService: PrismaService) {}

	async create(createMemberDto: CreateMemberDto) {
		const { id } = createMemberDto;
		const member = await this.prismaService.member.create({
			data: { id },
		});
		return member;
	}

	findAll() {
		const members = this.prismaService.member.findMany();
		return members;
	}

	// findOne(id: number) {
	// 	return `This action returns a #${id} member`;
	// }

	// update(id: number, updateMemberDto: UpdateMemberDto) {
	// 	return `This action updates a #${id} member`;
	// }

	async remove(id: string) {
		const member = this.prismaService.member.delete({
			where: { id },
		});
		return member;
	}
}
