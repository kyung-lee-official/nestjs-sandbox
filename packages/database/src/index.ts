import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./client/client.js";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });

// The client is instantiated once here, ready to be used
const prisma = new PrismaClient({
  adapter,
});

// Export everything from the generated client (includes all models and types)
export { PrismaClient } from "./client/client.js";
export * from "./client/enums.js";
export * from "./client/models.js";

// Export the configured prisma instance
export { prisma };
export default prisma;
