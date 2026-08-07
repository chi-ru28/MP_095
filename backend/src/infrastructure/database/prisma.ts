import { PrismaClient } from '@prisma/client';
import { logger } from '../logging/logger';

// Prevent multiple instances of Prisma Client in development
declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: [
      { emit: 'event', level: 'query' },
      { emit: 'event', level: 'error' },
      { emit: 'event', level: 'info' },
      { emit: 'event', level: 'warn' },
    ],
  });

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

prisma.$on('error', (e) => {
  logger.error(`[Prisma Error] ${e.message}`);
});

prisma.$on('warn', (e) => {
  logger.warn(`[Prisma Warn] ${e.message}`);
});
