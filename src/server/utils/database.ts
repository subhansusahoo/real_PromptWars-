// Database utility functions
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dbConnect = async (): Promise<void> => {
  try {
    await prisma.$connect();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

export const dbDisconnect = async (): Promise<void> => {
  await prisma.$disconnect();
};

export { prisma };
