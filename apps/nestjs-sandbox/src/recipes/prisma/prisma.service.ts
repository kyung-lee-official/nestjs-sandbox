import { Injectable, type OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@repo/database";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  // constructor() {
  // 	super({
  // 		log: ["query"],
  // 	});
  // }

  async onModuleInit() {
    await this.$connect();
  }
}
