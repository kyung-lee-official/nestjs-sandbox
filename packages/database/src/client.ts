import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/client/client.js";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });

// use globalThis for broad env compatibility (pnpm guide version)
const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

export const prisma: PrismaClient =
  globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
