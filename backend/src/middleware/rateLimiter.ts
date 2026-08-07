import { Request, Response, NextFunction } from 'express';
import { redisClient } from '../infrastructure/redis/redis.client';
import { AppError } from '../domain/exceptions/AppError';

/**
 * Basic Token Bucket Rate Limiter using Redis.
 * Allows `limit` requests per `windowSec`.
 */
export const rateLimiter = (limit: number = 100, windowSec: number = 60) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ip = req.ip || req.connection.remoteAddress || 'unknown';
      const key = `ratelimit:${ip}`;

      const current = await redisClient.incr(key);

      if (current === 1) {
        await redisClient.expire(key, windowSec);
      }

      if (current > limit) {
        throw new AppError('Too many requests, please try again later.', 429, 'RATE_LIMIT_EXCEEDED');
      }

      next();
    } catch (error) {
      // If Redis fails, log it and bypass the rate limiter
      console.warn('Redis rate limiter failed, bypassing...', (error as any).message);
      next();
    }
  };
};
