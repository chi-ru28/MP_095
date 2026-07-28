import Redis from 'ioredis';
import { logger } from '../logging/logger';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

export const redisClient = new Redis(redisUrl, {
  maxRetriesPerRequest: 3,
});

redisClient.on('connect', () => {
  logger.info('Connected to Redis');
});

redisClient.on('error', (err) => {
  logger.error(`Redis Error: ${err.message}`);
});

export const storeRefreshTokenInRedis = async (userId: string, token: string, expiresInSeconds: number) => {
  await redisClient.set(`refresh_token:${userId}:${token}`, 'active', 'EX', expiresInSeconds);
};

export const revokeRefreshTokenInRedis = async (userId: string, token: string) => {
  await redisClient.del(`refresh_token:${userId}:${token}`);
};

export const verifyRefreshTokenInRedis = async (userId: string, token: string): Promise<boolean> => {
  const result = await redisClient.get(`refresh_token:${userId}:${token}`);
  return result === 'active';
};

export const storeSession = async (userId: string, sessionData: any, expiresInSeconds: number = 3600) => {
  await redisClient.set(`session:${userId}`, JSON.stringify(sessionData), 'EX', expiresInSeconds);
};

export const getSession = async (userId: string) => {
  const data = await redisClient.get(`session:${userId}`);
  return data ? JSON.parse(data) : null;
};
