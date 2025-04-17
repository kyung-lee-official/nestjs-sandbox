import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import dayjs from "dayjs";

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

	async createRetailSalesData() {
		const order = await this.prisma.retailSalesData.create({
			data: {
				date: dayjs().toISOString(),
				receiptType: {
					connectOrCreate: {
						where: { type: "receiptType" },
						create: { type: "receiptType" },
					},
				},
				client: {
					connectOrCreate: {
						where: { client: "d.client" },
						create: { client: "d.client" },
					},
				},
				department: {
					connectOrCreate: {
						where: { department: "d.department" },
						create: { department: "d.department" },
					},
				},
				sku: {
					connectOrCreate: {
						where: { sku: "d.sku" },
						create: { sku: "d.sku" },
					},
				},
				// nameZhCn: "d.nameZhCn",
				// salesVolume: 100,
				// platformAddress: {
				// 	connectOrCreate: {
				// 		where: {
				// 			platformAddress: "d.platformAddress",
				// 		},
				// 		create: {
				// 			platformAddress: "d.platformAddress",
				// 		},
				// 	},
				// },
				// storehouse: {
				// 	connectOrCreate: {
				// 		where: { storehouse: "d.storehouse" },
				// 		create: { storehouse: "d.storehouse" },
				// 	},
				// },
				// category: {
				// 	connectOrCreate: {
				// 		where: { category: "d.category" },
				// 		create: { category: "d.category" },
				// 	},
				// },
				// taxInclusivePriceCny: 1.1,
				// priceCny: 1,
				// unitPriceCny: 7,
			},
		});
		return order;
	}
}
