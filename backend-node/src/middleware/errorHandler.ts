import { Request, Response, NextFunction } from 'express';
import { AppError } from '../domain/exceptions/AppError';
import { ResponseFormatter } from '../shared/responseFormatter';
import { logger } from '../infrastructure/logging/logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    logger.warn(`[AppError] ${err.statusCode} - ${err.message}`);
    return res
      .status(err.statusCode)
      .json(ResponseFormatter.error(err.message, err.code));
  }

  // Unhandled internal errors
  logger.error(`[UnhandledError] ${err.message}`, err);
  
  const statusCode = 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal Server Error' 
    : err.message;

  return res
    .status(statusCode)
    .json(ResponseFormatter.error(message, 'INTERNAL_SERVER_ERROR'));
};
