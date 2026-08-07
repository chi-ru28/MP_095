import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../domain/exceptions/AppError';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Missing or invalid authorization header', 401, 'AUTH_MISSING');
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    (req as any).user = payload;
    next();
  } catch (error) {
    throw new AppError('Invalid or expired token', 401, 'AUTH_INVALID_TOKEN');
  }
};
