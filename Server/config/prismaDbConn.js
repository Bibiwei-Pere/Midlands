// config/dbConn.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    log: [
        { emit: 'stdout', level: 'query' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'error' },
    ],
});

async function connectPrismaDB() {
    try {
        await prisma.$connect();
        console.log('Prisma connected to the database successfully');
    } catch (error) {
        console.error('Prisma connection failed:', error);
        process.exit(1);
    }
}

export { connectPrismaDB, prisma }; 