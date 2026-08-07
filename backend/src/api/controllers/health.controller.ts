import { Request, Response } from 'express';
import { ResponseFormatter } from '../../shared/responseFormatter';
import { prisma } from '../../infrastructure/database/prisma';
import { redisClient } from '../../infrastructure/redis/redis.client';
import { logger } from '../../infrastructure/logging/logger';

export class HealthController {
  static async check(req: Request, res: Response) {
    let dbStatus = 'ok';
    let redisStatus = 'ok';

    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch (e) {
      logger.error('Health Check - DB Error', e);
      dbStatus = 'error';
    }

    try {
      await redisClient.ping();
    } catch (e) {
      logger.error('Health Check - Redis Error', e);
      redisStatus = 'error';
    }

    const isHealthy = dbStatus === 'ok' && redisStatus === 'ok';

    const healthData = {
      apiStatus: 'ok',
      dbStatus,
      redisStatus,
      version: process.env.npm_package_version || '1.0.0',
      timestamp: new Date().toISOString(),
    };

    if (isHealthy) {
      res.json(ResponseFormatter.success(healthData));
    } else {
      res.status(503).json({
        success: false,
        error: {
          code: 'SERVICE_UNAVAILABLE',
          message: 'One or more services are down',
          details: healthData
        }
      });
    }
  }
}
