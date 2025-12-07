import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./client/client.js";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });

// The client is instantiated once here, ready to be used
const prisma = new PrismaClient({
  adapter,
  // log: ["query"], // Centralized logging configuration
});

// We only export the instance and the types for use
export * from "@prisma/client";
export { prisma };
export default prisma;
