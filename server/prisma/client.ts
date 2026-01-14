import "dotenv/config"
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

export const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

const prismaClient = new PrismaClient({adapter});

export { PrismaClient } from '@prisma/client';
export default prismaClient;