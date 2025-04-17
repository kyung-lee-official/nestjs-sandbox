import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Injectable()
export class OrderService {
	constructor(private prisma: PrismaService) {}

	async createOrder() {
		const order = await this.prisma.testConnectOrCreateOrder.create({
			data: {
				product: {
					connectOrCreate: {
						where: {
							name: "Product 1",
						},
						create: {
							name: "Product 1",
						},
					},
				},
			},
		});
	}
}
