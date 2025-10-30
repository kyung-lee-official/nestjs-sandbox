import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { Group } from "generated/prisma";

@Injectable()
export class GroupsService {
	constructor(private prisma: PrismaService) {}

	async createGroupWithOwner(body: any): Promise<Group> {
		const { name, email, ownerName } = body;
		const group = await this.prisma.group.create({
			data: {
				name: name,
				owner: {
					create: {
						email: email,
						name: ownerName,
					},
				},
				users: {
					connect: [
						{
							email: email,
						},
					],
				},
			},
		});
		return group;
	}

	async getAllGroups(): Promise<Group[]> {
		return await this.prisma.group.findMany({
			include: {
				owner: {
					include: {
						groups: true,
					},
				},
			},
		});
	}
}
