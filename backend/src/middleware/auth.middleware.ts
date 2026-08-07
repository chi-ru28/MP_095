import { Request, Response, NextFunction } from 'express';
import { JWTService } from '../services/jwt.service';
import { AppError } from '../domain/exceptions/AppError';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Missing or invalid authorization header', 401, 'AUTH_MISSING');
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = JWTService.verifyAccessToken(token);
    (req as any).user = payload;
    next();
  } catch (error) {
    throw new AppError('Invalid or expired token', 401, 'AUTH_INVALID_TOKEN');
  }
};
